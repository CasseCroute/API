import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository, Repository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {UpdateProductCommand} from '@letseat/application/commands/product';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';
import {Product} from '@letseat/domains/product/product.entity';
import {ProductIngredientRepository} from '@letseat/infrastructure/repository/product-ingredient.repository';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
	async execute(command: UpdateProductCommand, resolve: (value?) => void) {
		const productRepository = getCustomRepository(ProductRepository);
		const storeRepository = getCustomRepository(StoreRepository);
		const productIngredientRepository = getCustomRepository(ProductIngredientRepository);
		const product = Product.register(command.product);
		try {
			const storeFound = await storeRepository.findOneByUuid(command.storeUuid);
			await productRepository.updateProduct(storeFound.id, command.productUuid, product);

			if (product.ingredients && product.ingredients.length > 0) {
				const productFound = await productRepository.findStoreProductByUuid(command.storeUuid, command.productUuid);
				await productIngredientRepository.updateStoreProductIngredients(command.storeUuid, productFound as Product, product, new Repository<ProductIngredient>());
			}
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
