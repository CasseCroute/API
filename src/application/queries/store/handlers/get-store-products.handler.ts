import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreProductsQuery} from '@letseat/application/queries/store';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';

@CommandHandler(GetStoreProductsQuery)
export class GetStoreProductsHandler implements ICommandHandler<GetStoreProductsQuery> {
	async execute(command: GetStoreProductsQuery, resolve: (value?) => void) {
		const productRepository = getCustomRepository(ProductRepository);
		try {
			const ingredients = command.isPublic
				? await productRepository.findStoreProductsPublic(command.storeUuid)
				: await productRepository.findStoreProducts(command.storeUuid);
			resolve(ingredients);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
