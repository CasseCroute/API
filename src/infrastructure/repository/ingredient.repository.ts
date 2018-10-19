/* tslint:disable:no-duplicate-string */
import {EntityRepository, Repository} from 'typeorm';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {omitDeep} from '@letseat/shared/utils';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
	public async findOneByUuid(uuid: string) {
		const customer = await this.findOne({where: {uuid}});
		return omitDeep('id', customer);
	}

	public async findStoreIngredients(storeUuid: string, selectId = false) {
		const storeIngredients = await this.createQueryBuilder('ingredient')
			.select()
			.leftJoin('ingredient.store', 'store')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
		return selectId ? storeIngredients : omitDeep('id', storeIngredients);
	}

	public async findStoreIngredientsPublic(storeUuid: string, selectId = false) {
		const storeIngredients = await this.createQueryBuilder('ingredient')
			.select('ingredient.name')
			.leftJoin('ingredient.store', 'store')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
		return selectId ? storeIngredients : omitDeep('id', storeIngredients);
	}

	public async findStoreIngredientByUuid(storeUuid: string, ingredientUuid: string, selectId = false) {
		const storeIngredients = await this.createQueryBuilder('ingredient')
			.select('ingredient')
			.leftJoin('ingredient.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.where('ingredient.uuid = :uuid', {uuid: ingredientUuid})
			.getOne();
		return selectId ? storeIngredients : omitDeep('id', storeIngredients);
	}

	/**
	 * Same as findStoreIngredientByUuid except that this method doesn't return private properties
	 */
	public async findStoreIngredientByUuidPublic(storeUuid: string, ingredientUuid: string, selectId = false) {
		const storeIngredients = await this.createQueryBuilder('ingredient')
			.select('ingredient.name')
			.leftJoin('ingredient.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.where('ingredient.uuid = :uuid', {uuid: ingredientUuid})
			.getOne();
		return selectId ? storeIngredients : omitDeep('id', storeIngredients);
	}
}
