import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {BadRequestException} from '@nestjs/common';
import {CreateProductCommand} from '../create-order.command';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {ProductIngredientRepository} from '@letseat/infrastructure/repository/product-ingredient.repository';
import {InjectRepository} from '@nestjs/typeorm';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
	constructor(
		@InjectRepository(StoreRepository)
		private readonly storeRepository: StoreRepository,
		@InjectRepository(ProductIngredientRepository)
		private readonly productIngredientRepository: ProductIngredientRepository) {
	}

	async execute(command: CreateProductCommand, resolve: (value?) => void) {
		try {
			const savedProduct = await this.storeRepository.saveStoreProduct(command.storeUuid, command.product as any);
			if (command.product.ingredients && command.product.ingredients.length > 0) {
				await this.productIngredientRepository.saveStoreProductIngredients(command.storeUuid, savedProduct);
			}
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
