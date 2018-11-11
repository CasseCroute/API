/* tslint:disable */
import {
	EntityRepository, getCustomRepository, getRepository,
	Repository
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {
	Order,
	OrderDetailMeal,
	OrderDetailMealOptionIngredient, OrderDetailMealOptionProduct,
	OrderDetailProduct
} from '@letseat/domains/order/order.entity';
import {
	CartMeal,
	CartProduct
} from '@letseat/domains/cart/cart.entity';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {LoggerService} from '@letseat/infrastructure/services';

@EntityRepository(OrderDetailProduct)
export class OrderDetailProductRepository extends Repository<OrderDetailProduct> implements ResourceRepository {
	public async findOneByUuid(uuid: string) {
		return this.findOne({where: {uuid}});
	}

	public async saveOrderDetailProduct(product: CartProduct, order: Order) {
		try {
			const orderDetailProduct = new OrderDetailProduct();
			orderDetailProduct.product = product.product;
			orderDetailProduct.quantity = product.quantity;
			orderDetailProduct.instructions = product.instructions;
			orderDetailProduct.price = product.product.price;
			orderDetailProduct.order = order;
			order.totalPaid = (parseFloat(order.totalPaid as any) + parseFloat(product.product.price as any));
			await getCustomRepository(OrderRepository).save(order);
			return this.save(orderDetailProduct);
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
	}
}

@EntityRepository(OrderDetailMeal)
export class OrderDetailMealRepository extends Repository<OrderDetailMeal> implements ResourceRepository {
	public async findOneByUuid(uuid: string) {
		return this.findOne({where: {uuid}});
	}

	public async saveOrderDetailMeal(meal: CartMeal, order: Order) {
		try {
			const orderDetailMeal = new OrderDetailMeal();
			orderDetailMeal.meal = meal.meal;
			orderDetailMeal.quantity = meal.quantity;
			orderDetailMeal.instructions = meal.instructions;
			orderDetailMeal.price = meal.meal.price;
			orderDetailMeal.order = order;
			order.totalPaid = (parseFloat(order.totalPaid as any) + parseFloat(meal.meal.price as any));

			await getCustomRepository(OrderRepository).save(order);
			return this.save(orderDetailMeal).then(res => {
				if (meal.ingredientOptions && meal.ingredientOptions.length > 0) {
					meal.ingredientOptions.forEach(async ingredientOption => {
						const mealOptionIngredient = new OrderDetailMealOptionIngredient();
						mealOptionIngredient.optionIngredient = ingredientOption.optionIngredient;
						mealOptionIngredient.orderDetailMeal = res;

						order.totalPaid = (parseFloat(order.totalPaid as any) + parseFloat(ingredientOption.optionIngredient.price as any));
						await getRepository(OrderDetailMealOptionIngredient).save(mealOptionIngredient);
						await getCustomRepository(OrderRepository).save(order);
					});
				}

				if (meal.productOptions && meal.productOptions.length > 0) {
					meal.productOptions.forEach(async productOption => {
						const mealOptionProduct = new OrderDetailMealOptionProduct();
						mealOptionProduct.optionProduct = productOption.optionProduct;

						mealOptionProduct.orderDetailMeal = res;
						order.totalPaid = (parseFloat(order.totalPaid as any) + parseFloat(productOption.optionProduct.price as any));
						await getRepository(OrderDetailMealOptionProduct).save(mealOptionProduct);
						await getCustomRepository(OrderRepository).save(order);
					});
				}
			});
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
	}
}
