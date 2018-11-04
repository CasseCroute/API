/* tslint:disable:no-unused */
import {
	EntityRepository,
	Repository,
	Transaction,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {LoggerService} from '@letseat/infrastructure/services';
import {MealSubsectionOptionProduct} from '@letseat/domains/meal/meal-subsection-option-product.entity';
import {
	UpdateMealSubsectionOptionProductDto
} from '@letseat/domains/meal/dtos';

@EntityRepository(MealSubsectionOptionProduct)
export class MealSubsectionOptionProductRepository extends Repository<MealSubsectionOptionProduct> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(mealSubscetionOptionProductUuid: string) {
		return this.findOne({where: {uuid: mealSubscetionOptionProductUuid}});
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
