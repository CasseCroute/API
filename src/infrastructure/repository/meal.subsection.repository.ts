/* tslint:disable */
import {
	createQueryBuilder,
	EntityRepository, getConnection, getManager,
	Repository,
	Transaction, TransactionManager,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsection} from '@letseat/domains/meal/meal-subsection.entity';
import {LoggerService} from '@letseat/infrastructure/services';
import {MealSubsectionOptionProduct} from '@letseat/domains/meal/meal-subsection-option-product.entity';
import {MealSubsectionOption} from '@letseat/domains/meal/meal-subsection-option.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {Store} from '@letseat/domains/store/store.entity';

@EntityRepository(MealSubsection)
export class MealSubsectionRepository extends Repository<MealSubsection> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(mealSubscetionUuid: string, selectId: boolean = false) {
		const mealSubsection = await this.findOne({where: {uuid: mealSubscetionUuid}});
		return selectId ? mealSubsection : omitDeep('id', mealSubsection);
	}

	/**
	 * Bulk insert Meal Subsection
	 */
	public async saveStoreMealSubsections(store: Store, meal: Meal) {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.startTransaction();
		if (meal.subsections && meal.subsections.length > 0) {
			try {
				// Bulk insert meal subsections
				meal.subsections.forEach(async (subsection) => {
					const mealSubsection = new MealSubsection(subsection);
					const mealSubsectionOption = new MealSubsectionOption();
					const {products} = subsection as any;
					mealSubsection.meal = await queryRunner.manager
						.findOneOrFail(Meal,{
						where: {uuid: meal.uuid}
					}) as Meal;
					mealSubsectionOption.subsection = mealSubsection;
					await getManager().save(mealSubsection);
					await getManager().save(mealSubsectionOption);
					if (products && products.length > 0) {
						await this.saveStoreMealSubsectionOptionProducts(mealSubsectionOption, products);
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
	 * Bulk insert Meal Subsection Option Productss
	 */
	public async saveStoreMealSubsectionOptionProducts(subsectionOption: MealSubsectionOption, productsUuids: any[]) {
		try {
			productsUuids.forEach(async (productUuid) => {
				const subsectionOptionProduct = new MealSubsectionOptionProduct();
				subsectionOptionProduct.product = await getManager()
					.findOneOrFail(Product, {
						where: {uuid: productUuid.uuid}
					}) as Product;
				subsectionOptionProduct.option = subsectionOption;
				await getManager().save(subsectionOptionProduct);
			});
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
		return;
	}
}
