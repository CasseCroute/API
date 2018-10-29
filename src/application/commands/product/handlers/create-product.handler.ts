import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository, Repository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {CreateProductCommand} from '../create-product.command';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {ProductIngredientRepository} from '@letseat/infrastructure/repository/product-ingredient.repository';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
	async execute(command: CreateProductCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const productIngredientRepository = getCustomRepository(ProductIngredientRepository);
		try {
			const savedProduct = await storeRepository.saveStoreProduct(command.storeUuid, command.product as any);
			if (command.product.ingredients && command.product.ingredients.length > 0) {
				await productIngredientRepository.saveStoreProductIngredients(command.storeUuid, savedProduct, new Repository<ProductIngredient>());
			}
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
