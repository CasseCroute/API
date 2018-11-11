/* tslint:disable */
import {
	EntityRepository, getCustomRepository,
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

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> implements ResourceRepository {
	public async findOneByUuid(uuid: string) {
		return this.findOne({where: {uuid}});
	}

	public async createOrder(customer: Customer, orderDto: CreateOrderDto) {
		const order = new Order();
		order.deliveryAddress = orderDto.deliveryAddress;
		order.isGuest = orderDto.isGuest;
		order.deliveryNote = orderDto.deliveryNote;

		order.firstName = customer.firstName;
		order.lastName = customer.lastName;
		order.email = customer.email;
		order.phoneNumber = customer.phoneNumber;
		order.store = customer.cart.store;
		order.customer = customer;

		order.totalPaid = 0;

		order.reference = cryptoRandomString(6).toUpperCase();
		return this.save(order).then(res => {
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
		});
	}
}
