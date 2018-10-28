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

@EntityRepository(MealSubsectionOptionProduct)
export class MealSubsectionOptionProductRepository extends Repository<MealSubsectionOptionProduct> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(mealSubscetionOptionProductUuid: string, selectId = false) {
		const mealSubscetionOptionProduct = await this.findOne({where: {uuid: mealSubscetionOptionProductUuid}});
		return selectId ? mealSubscetionOptionProduct : omitDeep('id', mealSubscetionOptionProduct);
	}

	/**
	 * Bulk update Meal Subsection Option Products
	 */
	public async updateStoreMealSubsectionOptionProducts(
		storeUuid: string,
		products: UpdateMealSubsectionOptionProductDto[]) {
		try {
			products.forEach(async product => {
				const {optionProductUuid, ...values} = product;
				if (await this.belongsToStore(storeUuid, optionProductUuid)) {
					await this.update({uuid: optionProductUuid}, values);
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
		optionProductUuid: string
	): Promise<boolean> {
		const rawData = await this.createQueryBuilder('mealSubsectionOptionProduct')
			.leftJoinAndSelect('mealSubsectionOptionProduct.product', 'product')
			.leftJoinAndSelect('product.store', 'store', 'store.uuid = :storeUuid', {storeUuid})
			.where('mealSubsectionOptionProduct.uuid = :optionProductUuid', {optionProductUuid})
			.getRawOne();
		return rawData.store_uuid === storeUuid;
	}
}
