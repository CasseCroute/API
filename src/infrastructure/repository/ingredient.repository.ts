import {EntityRepository, getConnection, getRepository, ObjectLiteral, Repository} from 'typeorm';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {omitDeep} from '@letseat/shared/utils';

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient> {
	public async findOneByUuid(uuid: string) {
		const customer = await this.findOne({where: {uuid}});
		return omitDeep('id', customer);
	}

	public async updateIngredient(storeId: number, ingredientUuid: string, values: ObjectLiteral) {
		return getRepository(Ingredient)
			.createQueryBuilder('ingredient')
			.update()
			.set(values)
			.where('id_store = :id and uuid = :uuid', {id: storeId, uuid: ingredientUuid})
			.execute();
	}

	public async deleteIngredient(storeId: number, ingredientUuid: string) {
		return getConnection()
			.createQueryBuilder()
			.delete()
			.from(Ingredient)
			.where('uuid = :uuid AND id_store = :id', {uuid: ingredientUuid, id: storeId})
			.execute();
	}
}
