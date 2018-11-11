import {
	EntityRepository,
	Repository
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {Order} from '@letseat/domains/order/order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> implements ResourceRepository {
	public async findOneByUuid(uuid: string) {
		return this.findOne({where: {uuid}});
	}
}
