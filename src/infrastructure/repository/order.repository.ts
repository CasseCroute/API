/* tslint:disable */
import {
	EntityRepository, getCustomRepository, getRepository,
	Repository
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {
	Order,
} from '@letseat/domains/order/order.entity';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {CreateOrderDto} from '@letseat/domains/order/dtos';
import {cryptoRandomString} from '@letseat/shared/utils';
import {
	OrderDetailMealRepository, OrderDetailProductRepository,
} from '@letseat/infrastructure/repository/order-detail.repository';
import {OrderHistory, OrderStatus} from '@letseat/domains/order/order-history.entity';
import {Store} from '@letseat/domains/store/store.entity';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';
import {CreateGuestOrderDto} from '@letseat/domains/order/dtos/create-order.dto';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> implements ResourceRepository {
	private readonly orderStatusRepository = getRepository(OrderStatus);
	private readonly productRepository = getCustomRepository(ProductRepository);
	private readonly mealRepository = getCustomRepository(MealRepository);
	private readonly orderHistoryRepository = getRepository(OrderHistory);

	public async findOneByUuid(uuid: string, relations?: string[]) {
		return this.findOne({where: {uuid}, relations});
	}

	public async findOneByUuidAndStore(mealUuid: string, store: Store, relations?: string[]) {
		return this.findOne({where: {uuid: mealUuid, store: store}, relations});
	}

	public async createOrder(customer: Customer, orderDto: CreateOrderDto) {
		const order = new Order(orderDto);
		const history = new OrderHistory();
		// @TODO: Set Order Status Dynamically (by default an order is Paid)
		const paidStatus = await this.orderStatusRepository.findOne({where: {uuid: 'f77ee6a1-7498-4a64-860c-a6f5d2d26514'}});

		order.isGuest = false;
		order.firstName = customer.firstName;
		order.lastName = customer.lastName;
		order.email = customer.email;
		order.phoneNumber = customer.phoneNumber;
		order.store = customer.cart.store;
		order.customer = customer;

		history.status = paidStatus as OrderStatus;

		order.totalPaid = orderDto.totalToPay;

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
				 await this.save(res);
				 return res.uuid;
			});
		});
	}

	public async createGuestOrder(guestOrder: CreateGuestOrderDto, store: Store): Promise<any> {
		const order = new Order(guestOrder);
		const history = new OrderHistory();
		// @TODO: Set Order Status Dynamically (by default an order is Paid)
		const paidStatus = await this.orderStatusRepository.findOneOrFail({where: {uuid: 'f77ee6a1-7498-4a64-860c-a6f5d2d26514'}});

		order.isGuest = true;
		order.store = store;
		history.status = paidStatus;

		order.totalPaid = guestOrder.totalToPay;

		order.reference = cryptoRandomString(6).toUpperCase();
		return this.save(order).then(async res => {
			guestOrder.cart.forEach(async product => {
				if (product.mealUuid){
					const storeMeal = await this.mealRepository.findOneByUuidAndStore(product.mealUuid, store.uuid);
					if (storeMeal) {
						await getCustomRepository(OrderDetailMealRepository)
						.saveGuestOrderDetailMeal(storeMeal, product.quantity, res, product.optionUuids);
					}
				} else if (product.productUuid){
					const storeProduct = await this.productRepository.findOneByUuidAndStore(product.productUuid, store.uuid);
					if (storeProduct) {
						await getCustomRepository(OrderDetailProductRepository)
						.saveGuestOrderDetailProduct(storeProduct, product.quantity, res);
					}
				}
			});
			history.order = res;
			return this.orderHistoryRepository.save(history).then(async historyRes => {
				res.history = [historyRes];
				return this.save(res);
			});
		});
	}
}


