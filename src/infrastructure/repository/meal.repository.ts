import {
	EntityRepository,
	Repository,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Meal} from '@letseat/domains/meal/meal.entity';

@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> implements ResourceRepository {
	public async findOneByUuid(mealUuid: string, selectId = false) {
		const meal = await this.findOne({where: {uuid: mealUuid}});
		return selectId ? meal : omitDeep('id', meal);
	}

	public async findStoreMeals(storeUuid: string, selectId = false) {
		const storeMeals = await this.createQueryBuilder('meal')
			.select()
			.leftJoin('meal.store', 'store')
			.leftJoinAndSelect('meal.subsections', 'meal_subsections')
			.leftJoinAndSelect('meal_subsections.options', 'meal_subsections_options')
			.leftJoinAndSelect('meal_subsections_options.products', 'meal_subsections_options_products')
			.leftJoinAndSelect('meal_subsections_options.ingredients', 'meal_subsections_options_ingredients')
			.leftJoinAndSelect('meal_subsections_options_ingredients.ingredient', 'meal_subsections_options_ingredients_ingredient')
			.leftJoinAndSelect('meal_subsections_options_products.product', 'meal_subsections_options_products_product')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
		return selectId ? storeMeals : omitDeep('id', storeMeals);
	}

	public async deleteStoreMealByUuid(storeId: number, mealUuid: string) {
		return this.createQueryBuilder('meal')
			.delete()
			.where('uuid = :uuid AND id_store = :id', {uuid: mealUuid, id: storeId})
			.execute();
	}
}
