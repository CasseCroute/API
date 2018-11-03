/* tslint:disable:no-unused */
import {
	EntityRepository,
	Repository
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {LoggerService} from '@letseat/infrastructure/services';
import {MealSubsectionOptionIngredient} from '@letseat/domains/meal/meal-subsection-option-ingredient.entity';
import {
	UpdateMealSubsectionOptionIngredientDto,
} from '@letseat/domains/meal/dtos';

@EntityRepository(MealSubsectionOptionIngredient)
export class MealSubsectionOptionIngredientRepository extends Repository<MealSubsectionOptionIngredient> implements ResourceRepository {
	public async findOneByUuid(mealSubscetionOptionIngredientUuid: string) {
		return this.findOne({where: {uuid: mealSubscetionOptionIngredientUuid}});
	}

	/**
	 * Bulk update Meal Subsection Option Ingredients
	 */
	public async updateStoreMealSubsectionOptionIngredients(
		storeUuid: string,
		ingredients: UpdateMealSubsectionOptionIngredientDto[]
	) {
		try {
			ingredients.forEach(async ingredient => {
				const {optionIngredientUuid, ...values} = ingredient;
				if (await this.belongsToStore(storeUuid, optionIngredientUuid)) {
					await this.update({uuid: optionIngredientUuid}, values);
				}
			});
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
		return;
	}

	private async belongsToStore(
		storeUuid: string,
		optionIngredientUuid: string
	): Promise<boolean> {
		const rawData = await this.createQueryBuilder('mealSubsectionOptionIngredient')
			.leftJoinAndSelect('mealSubsectionOptionIngredient.ingredient', 'ingredient')
			.leftJoinAndSelect('ingredient.store', 'store', 'store.uuid = :storeUuid', {storeUuid})
			.where('mealSubsectionOptionIngredient.uuid = :optionIngredientUuid', {optionIngredientUuid})
			.getRawOne();
		return rawData.store_uuid === storeUuid;
	}
}
