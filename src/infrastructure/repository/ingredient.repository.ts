/* tslint:disable:no-duplicate-string */
import {EntityRepository, ObjectLiteral, Repository} from 'typeorm';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
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
}
