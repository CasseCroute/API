/* tslint:disable */
import {
	EntityRepository, ObjectLiteral,
	Repository,
	Transaction,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Meal} from '@letseat/domains/meal/meal.entity';

@EntityRepository(Meal)
export class ProductRepository extends Repository<Meal> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(mealUuid: string, selectId: boolean = false) {
		const meal = await this.findOne({where: {uuid: mealUuid}});
		return selectId ? meal : omitDeep('id', meal);
	}
}
