/* tslint:disable:no-unused */
import {
	EntityRepository, getConnection, getManager, getRepository,
	Repository,
	Transaction,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsection} from '@letseat/domains/meal/meal-subsection.entity';
import {LoggerService} from '@letseat/infrastructure/services';
import {MealSubsectionOptionProduct} from '@letseat/domains/meal/meal-subsection-option-product.entity';
import {MealSubsectionOption} from '@letseat/domains/meal/meal-subsection-option.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {MealSubsectionOptionIngredient} from '@letseat/domains/meal/meal-subsection-option-ingredient.entity';
import {
	CreateMealSubsectionOptionIngredientDto,
	CreateMealSubsectionOptionProductDto,
	UpdateMealSubsectionDto,
	UpdateMealSubsectionOptionIngredientDto,
	UpdateMealSubsectionOptionProductDto
} from '@letseat/domains/meal/dtos';
import {Store} from '@letseat/domains/store/store.entity';

@EntityRepository(MealSubsectionOptionIngredient)
export class MealSubsectionOptionIngredientRepository extends Repository<MealSubsectionOptionIngredient> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(mealSubscetionOptionIngredientUuid: string, selectId = false) {
		const mealSubscetionOptionIngredient = await this.findOne({where: {uuid: mealSubscetionOptionIngredientUuid}});
		return selectId ? mealSubscetionOptionIngredient : omitDeep('id', mealSubscetionOptionIngredient);
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
