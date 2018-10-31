/* tslint:disable */
import {
	EntityRepository,
	Repository,
	Transaction,
	TransactionManager, createQueryBuilder, getManager,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';
import {CreateProductDto} from '@letseat/domains/product/dtos';

@EntityRepository(ProductIngredient)
export class ProductIngredientRepository extends Repository<ProductIngredient> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(productIngredientUuid: string, selectId: boolean = false) {
		const productIngredient = await this.findOne({where: {uuid: productIngredientUuid}}) as ProductIngredient;
		return selectId ? productIngredient : omitDeep('id', productIngredient);
	}

	@Transaction()
	public async saveStoreProductIngredients(
		storeUuid: string,
		product: CreateProductDto & Product,
		@TransactionManager() productIngredientRepository: Repository<ProductIngredient>) {
		const savedProduct = await getManager()
			.findOne(Product, {where: {id: product.id}}) as Product;
		product.ingredients.forEach(async (productIng) => {
			const productIngredient = new ProductIngredient();
			const ingredient = await createQueryBuilder(Ingredient, 'ingredient')
				.leftJoinAndSelect('ingredient.store', 'store')
				.where('store.uuid = :storeUuid and ingredient.uuid = :ingredientUuid', {storeUuid, ingredientUuid: productIng.ingredientUuid})
				.getOne() as Ingredient;
			productIngredient.quantity = productIng.quantity;
			productIngredient.product = savedProduct;
			productIngredient.ingredient = ingredient;
			await this.save(productIngredient);
		});
		return
	}

	@Transaction()
	public async updateStoreProductIngredients(
		storeUuid: string,
		productUuid: string,
		product: Product,
		@TransactionManager() productIngredientRepository: Repository<ProductIngredient>) {
		product.ingredients.forEach(async (productIng) => {
			if (productIng.quantity && await this.productIngredientBelongsToStore(storeUuid, productIng.uuid)) {
				const productIngredient = await this
					.findOne({where: {uuid: productIng.uuid}}) as ProductIngredient;
				productIngredient.quantity = productIng.quantity;
				return this.save(productIngredient);
			}
		});
		return;
	}

	public async productIngredientBelongsToStore(storeUuid: string, productIngredientUuid: string) {
		const store = await createQueryBuilder(ProductIngredient, 'productIngredient')
			.select('store')
			.where('productIngredient.uuid = :uuid', {uuid: productIngredientUuid})
			.leftJoin('productIngredient.product', 'product')
			.leftJoin('product.store', 'store')
			.getRawOne();
		return store.store_uuid === storeUuid;
	}
}
