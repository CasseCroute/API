/* tslint:disable:no-unused */
import {
	EntityRepository, getConnection, getCustomRepository, getManager, getRepository,
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
import {MealSubsectionOptionProductRepository} from '@letseat/infrastructure/repository/meal.subsection.product.repository';
import {MealSubsectionOptionIngredientRepository} from '@letseat/infrastructure/repository/meal.subsection.ingredient.repository';

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

	/**
	 * Bulk update Meal Subsection
	 */
	public async updateStoreMealSubsections(
		storeUuid: string,
		subsections: UpdateMealSubsectionDto[] & MealSubsection[]
	) {
		const mealSubsectionOptionProductRepository =
			getCustomRepository(MealSubsectionOptionProductRepository);
		const mealSubsectionOptionIngredientRepository =
			getCustomRepository(MealSubsectionOptionIngredientRepository);
		try {
			subsections.forEach(async subsection => {
				if (!subsection.subsectionUuid) {
					return;
				}
				const {options, subsectionUuid, ...values} = subsection;
				if (await this.belongsToStore(storeUuid, subsectionUuid)) {
					await this.update({uuid: subsectionUuid}, values);
				}
				if (options && options.products && options.products.length > 0) {
					await mealSubsectionOptionProductRepository
						.updateStoreMealSubsectionOptionProducts(storeUuid, options.products);
				}
				if (options && options.ingredients && options.ingredients.length > 0) {
					await mealSubsectionOptionIngredientRepository
						.updateStoreMealSubsectionOptionIngredients(storeUuid, options.ingredients);
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
		subsectionUuid: string
	): Promise<boolean> {
		const rawData = await this.createQueryBuilder('mealSubsection')
			.leftJoinAndSelect('mealSubsection.meal', 'meal')
			.leftJoinAndSelect('meal.store', 'store', 'store.uuid = :storeUuid', {storeUuid})
			.where('mealSubsection.uuid = :subsectionUuid', {subsectionUuid})
			.getRawOne();
		return rawData.store_uuid === storeUuid;
	}
}
