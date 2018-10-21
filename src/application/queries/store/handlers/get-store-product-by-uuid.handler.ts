/* tslint:disable:strict-type-predicates */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreProductByUuidQuery} from '@letseat/application/queries/store';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';
import {NotFoundException} from '@nestjs/common';

@CommandHandler(GetStoreProductByUuidQuery)
export class GetStoreProductByUuidHandler implements ICommandHandler<GetStoreProductByUuidQuery> {
	async execute(command: GetStoreProductByUuidQuery, resolve: (value?) => void) {
		const productRepository = getCustomRepository(ProductRepository);
		try {
			const product = command.isPublic
				? await productRepository.findStoreProductByUuidPublic(command.storeUuid, command.productUuid)
				: await productRepository.findStoreProductByUuid(command.storeUuid, command.productUuid);

			if (typeof product === undefined) {
				resolve(Promise.reject(new NotFoundException('Product not found')));
			}
			resolve(product);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
