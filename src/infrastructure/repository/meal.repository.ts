import {
	EntityRepository,
	Repository,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {Meal} from '@letseat/domains/meal/meal.entity';

@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> implements ResourceRepository {
	public async findOneByUuid(mealUuid: string) {
		return this.findOne({where: {uuid: mealUuid}});
	}

	public async findOneByUuidAndStore(mealUuid: string, storeUuid: string) {
		return this.createQueryBuilder('meal')
		.leftJoin('meal.store', 'store')
		.where('meal.uuid = :mealUuid', {mealUuid})
		.andWhere('store.uuid = :storeUuid', {storeUuid})
		.getOne();
	}

	public async findStoreMeals(storeUuid: string) {
		return this.createQueryBuilder('meal')
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
	}

	public async deleteStoreMealByUuid(storeId: number, mealUuid: string) {
		return this.createQueryBuilder('meal')
			.delete()
			.where('uuid = :uuid AND id_store = :id', {uuid: mealUuid, id: storeId})
			.execute();
	}
}
