/* tslint:disable */
import {
	EntityRepository,
	getConnection,
	ObjectLiteral,
	getRepository,
	Repository,
	Transaction,
	TransactionManager, getManager, createQueryBuilder,
} from 'typeorm';
import {Store} from '@letseat/domains/store/store.entity';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {CreateKioskCommand} from '@letseat/application/commands/store/create-kiosk.command';
import {omitDeep} from '@letseat/shared/utils';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';

@EntityRepository(ProductIngredient)
export class ProductIngredientRepository extends Repository<ProductIngredient> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(productIngredientUuid: string, selectId: boolean = false) {
		const productIngredient = await this.findOne({where: {uuid: productIngredientUuid}});
		return selectId ? productIngredient : omitDeep('id', productIngredient);
	}

	@Transaction()
	public async saveStoreProductIngredients(
		storeUuid: string,
		product: Product,
		@TransactionManager() storeRepository: Repository<Store>) {
		const savedProduct = await getManager()
			.findOne(Product, {where: {reference: product.reference}}) as Product;
		product.ingredients.forEach(async (productIng) => {
			const productIngredient = new ProductIngredient();
			const ingredient = await getManager()
				.findOne(Ingredient, {where: {uuid: productIngredient.uuid}}) as Ingredient;
			productIngredient.quantity = productIng.quantity;
			productIngredient.product = savedProduct;
			productIngredient.ingredient = ingredient;
			await this.save(productIngredient);
		});
		return
	}
}
