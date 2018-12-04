/* tslint:disable */
import {EntityRepository, getCustomRepository, ObjectLiteral, Repository} from 'typeorm';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
	private readonly productRepository = getCustomRepository(ProductRepository);

	public async findOneByUuid(uuid: string) {
		return this.findOne({where: {uuid}});
	}

	public async updateIngredient(storeId: number, ingredientUuid: string, values: ObjectLiteral) {
		return this.createQueryBuilder('ingredient')
			.update()
			.set(values)
			.where('id_store = :id and uuid = :uuid', {id: storeId, uuid: ingredientUuid})
			.execute();
	}

	public async findStoreIngredients(storeUuid: string) {
		return this.createQueryBuilder('ingredient')
			.select()
			.leftJoin('ingredient.store', 'store')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
	}

	public async findStoreIngredientsPublic(storeUuid: string) {
		return this.createQueryBuilder('ingredient')
			.select('ingredient.name')
			.leftJoin('ingredient.store', 'store')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
	}

	public async findStoreIngredientByUuid(storeUuid: string, ingredientUuid: string) {
		return this.createQueryBuilder('ingredient')
			.select('ingredient')
			.leftJoin('ingredient.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.where('ingredient.uuid = :uuid', {uuid: ingredientUuid})
			.getOne();
	}

	/**
	 * Same as findStoreIngredientByUuid except that this method doesn't return private properties
	 */
	public async findStoreIngredientByUuidPublic(storeUuid: string, ingredientUuid: string) {
		return this.createQueryBuilder('ingredient')
			.select('ingredient.name')
			.leftJoin('ingredient.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.where('ingredient.uuid = :uuid', {uuid: ingredientUuid})
			.getOne();
	}

	public async deleteStoreIngredientByUuid(storeId: number, ingredientUuid: string) {
		return this.createQueryBuilder('ingredient')
			.delete()
			.where('uuid = :uuid AND id_store = :id', {uuid: ingredientUuid, id: storeId})
			.execute();
	}

	public async decrementIngredientQuantityByUuid(ingredientUuid: string, quantityToDecrement: number) {
		const ingredient = await this.findOne({where: {uuid: ingredientUuid}});
		if (ingredient) {
			ingredient.quantity -= quantityToDecrement;
			return this.save(ingredient);
		}
	}

	public async decrementProductIngredientQuantityByUuid(productUuid: string, timesToDecrement: number) {
		const product = await this.productRepository.findProductWithIngredients(productUuid);
		if (product) {
			return product.ingredients.forEach(async productIngredient => {
				productIngredient.ingredient.quantity -= productIngredient.quantity * timesToDecrement;
				return this.save(productIngredient.ingredient);
			});
		}
	}
}
