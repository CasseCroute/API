import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {DeleteProductCommand} from '../delete-product.command';
import {ProductRepository} from '../../../../infrastructure/repository/product.repository';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
	async execute(command: DeleteProductCommand, resolve: (value?) => void) {
		const productRepository = getCustomRepository(ProductRepository);

		try {
			await productRepository.deleteProductByUuid(command.storeUuid, command.productUuid);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
