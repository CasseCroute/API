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

@EntityRepository(Meal)
export class MealSubsectionRepository extends Repository<MealSubsection> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(mealSubscetionUuid: string, selectId: boolean = false) {
		const mealSubsection = await this.findOne({where: {uuid: mealSubscetionUuid}});
		return selectId ? mealSubsection : omitDeep('id', mealSubsection);
	}

	/**
	 * Bulk insert Meal Subsection
	 */
	public async saveStoreMealSubsections(meal: Meal) {
		if (meal.subsections && meal.subsections.length > 0) {
			try {
				meal.subsections.forEach(async (subsection) => {
					const mealSubsection = new MealSubsection(subsection);
					mealSubsection.meal = meal;
					await this.save(mealSubsection);
				});
			} catch (err) {
				const logger = new LoggerService('Database');
				logger.error(err.message, err.stack);
			}
		}
		return;
	}
}
