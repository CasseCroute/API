/* tslint:disable */
import {
	EntityRepository, getCustomRepository, getRepository,
	Repository
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {Order} from '@letseat/domains/order/order.entity';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {CreateOrderDto} from '@letseat/domains/order/dtos';
import {cryptoRandomString} from '@letseat/shared/utils';
import {
	OrderDetailMealRepository, OrderDetailProductRepository,
} from '@letseat/infrastructure/repository/order-detail.repository';
import {OrderHistory, OrderStatus} from '@letseat/domains/order/order-history.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> implements ResourceRepository {
	private readonly orderStatusRepository = getRepository(OrderStatus);
	private readonly orderHistoryRepository = getRepository(OrderHistory);

	public async findOneByUuid(uuid: string, relations?: string[]) {
		return this.findOne({where: {uuid}, relations});
	}

	public async createOrder(customer: Customer, orderDto: any) {
		const order = new Order(orderDto);
		const history = new OrderHistory();
		// @TODO: Set Order Status Dynamically (by default an order is Paid)
		const paidStatus = await this.orderStatusRepository.findOne({where: {uuid: 'f77ee6a1-7498-4a64-860c-a6f5d2d26514'}});

		order.firstName = customer.firstName;
		order.lastName = customer.lastName;
		order.email = customer.email;
		order.phoneNumber = customer.phoneNumber;
		order.store = customer.cart.store;
		order.customer = customer;

		history.status = paidStatus as OrderStatus;

		order.totalPaid = 0;

		order.reference = cryptoRandomString(6).toUpperCase();
		return this.save(order).then(async res => {
			if (customer.cart.meals && customer.cart.meals.length > 0) {
				customer.cart.meals.forEach(async meal => {
					await getCustomRepository(OrderDetailMealRepository).saveOrderDetailMeal(meal, res);
				});
			}
			if (customer.cart.products && customer.cart.products.length > 0) {
				customer.cart.products.forEach(async product => {
					await getCustomRepository(OrderDetailProductRepository).saveOrderDetailProduct(product, res);
				});
			}
			history.order = res;
			return this.orderHistoryRepository.save(history).then(async historyRes => {
				res.history = [historyRes];
				return this.save(res);
			});
		});
	}
}
