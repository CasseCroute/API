/* tslint:disable:no-unused */
import {
	EntityRepository, getConnection, getManager,
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
	CreateMealSubsectionOptionProductDto
} from '@letseat/domains/meal/dtos';

@EntityRepository(MealSubsection)
export class MealSubsectionRepository extends Repository<MealSubsection> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(mealSubscetionUuid: string, selectId = false) {
		const mealSubsection = await this.findOne({where: {uuid: mealSubscetionUuid}});
		return selectId ? mealSubsection : omitDeep('id', mealSubsection);
	}

	/**
	 * Bulk insert Meal Subsection
	 */
	public async saveStoreMealSubsections(meal: Meal) {
		if (meal.subsections && meal.subsections.length > 0) {
			const queryRunner = getConnection().createQueryRunner();
			await queryRunner.startTransaction();
			try {
				// Bulk insert meal subsections
				meal.subsections.forEach(async subsection => {
					const mealSubsection = new MealSubsection(subsection);
					const mealSubsectionOption = new MealSubsectionOption();
					const {options} = subsection as any;
					mealSubsection.meal = await queryRunner.manager
						.findOneOrFail(Meal, {
							where: {uuid: meal.uuid}
						});
					mealSubsectionOption.subsection = mealSubsection;
					await getManager().save(mealSubsection);
					await getManager().save(mealSubsectionOption);
					if (options.products && options.products.length > 0) {
						await this.saveStoreMealSubsectionOptionProducts(mealSubsectionOption, options.products);
					}
					if (options.ingredients && options.ingredients.length > 0) {
						await this.saveStoreMealSubsectionOptionIngredients(mealSubsectionOption, options.ingredients);
					}
				});
			} catch (err) {
				const logger = new LoggerService('Database');
				logger.error(err.message, err.stack);
			}
		}
		return;
	}

	/**
	 * Bulk insert Meal Subsection Option Products
	 */
	public async saveStoreMealSubsectionOptionProducts(
		subsectionOption: MealSubsectionOption,
		products: any) {
		console.log(products);
		try {
			products.forEach(async product => {
				const {uuid, ...data} = product;
				const subsectionOptionProduct = new MealSubsectionOptionProduct(data);
				subsectionOptionProduct.product = await getManager()
					.findOneOrFail(Product, {
						where: {uuid: product.productUuid}
					});
				subsectionOptionProduct.option = subsectionOption;
				await getManager().save(subsectionOptionProduct);
			});
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
		return;
	}

	/**
	 * Bulk insert Meal Subsection Option Ingredients
	 */
	public async saveStoreMealSubsectionOptionIngredients(
		subsectionOption: MealSubsectionOption,
		ingredients: any) {
		try {
			ingredients.forEach(async ingredient => {
				const {uuid, ...data} = ingredient;
				const subsectionOptionIngredient = new MealSubsectionOptionIngredient(data);
				subsectionOptionIngredient.ingredient = await getManager()
					.findOneOrFail(Ingredient, {
						where: {uuid: ingredient.ingredientUuid}
					});
				subsectionOptionIngredient.option = subsectionOption;
				await getManager().save(subsectionOptionIngredient);
			});
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
		return;
	}
}
