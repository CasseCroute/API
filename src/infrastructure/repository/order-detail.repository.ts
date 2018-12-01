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
import {BadRequestException} from '@nestjs/common';
import {Product} from '@letseat/domains/product/product.entity';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsectionOptionIngredient} from '@letseat/domains/meal/meal-subsection-option-ingredient.entity';
import {MealSubsectionOptionProduct} from '@letseat/domains/meal/meal-subsection-option-product.entity';

@EntityRepository(OrderDetailProduct)
export class OrderDetailProductRepository extends Repository<OrderDetailProduct> implements ResourceRepository {
	private readonly logger = new LoggerService(OrderDetailProductRepository.name);

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
			await this.save(orderDetailProduct);
		} catch (err) {
			this.logger.error(err.message, err.stack);
			throw new BadRequestException();
		}
	}

	public async saveGuestOrderDetailProduct(product: Product, quantity: number, order: Order) {
		try {
			const orderDetailProduct = new OrderDetailProduct();
			orderDetailProduct.quantity = quantity;
			orderDetailProduct.price = product.price;
			orderDetailProduct.product = product;
			orderDetailProduct.order = order;
			await getCustomRepository(OrderRepository).save(order);
		} catch (err) {
			this.logger.error(err.message, err.stack);
			throw new BadRequestException();
		}
	}
}

@EntityRepository(OrderDetailMeal)
export class OrderDetailMealRepository extends Repository<OrderDetailMeal> implements ResourceRepository {
	private readonly logger = new LoggerService(OrderDetailMealRepository.name);

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

			return this.save(orderDetailMeal).then(res => {
				if (meal.ingredientOptions && meal.ingredientOptions.length > 0) {
					meal.ingredientOptions.forEach(async ingredientOption => {
						const mealOptionIngredient = new OrderDetailMealOptionIngredient();
						mealOptionIngredient.optionIngredient = ingredientOption.optionIngredient;
						mealOptionIngredient.orderDetailMeal = res;
						await getRepository(OrderDetailMealOptionIngredient).save(mealOptionIngredient);
					});
				}

				if (meal.productOptions && meal.productOptions.length > 0) {
					meal.productOptions.forEach(async productOption => {
						const mealOptionProduct = new OrderDetailMealOptionProduct();
						mealOptionProduct.optionProduct = productOption.optionProduct;
						mealOptionProduct.orderDetailMeal = res;
						await getRepository(OrderDetailMealOptionProduct).save(mealOptionProduct);
					});
				} else {
					return;
				}
			});
		} catch (err) {
			this.logger.error(err.message, err.stack);
			throw new BadRequestException();
		}
	}

	public async saveGuestOrderDetailMeal(meal: Meal, quantity: number, order: Order, optionUuids: string[]) {
		try {
			const orderDetailMeal = new OrderDetailMeal();
			orderDetailMeal.meal = meal;
			orderDetailMeal.quantity = quantity;
			orderDetailMeal.price = meal.price;
			orderDetailMeal.order = order;

			return this.save(orderDetailMeal).then(async res => {
				if (optionUuids && optionUuids.length > 0) {
					await this.saveGuestOrderMealOptions(optionUuids, res);
				}
			});
		} catch (err) {
			this.logger.error(err.message, err.stack);
			throw new BadRequestException();
		}
	}

	public async saveGuestOrderMealOptions(mealOptionUuids: string[], orderDetailMeal: OrderDetailMeal) {
		try {
			mealOptionUuids.forEach(async mealOptionUuid => {
				const subsectionOptionIngredient = await getRepository(MealSubsectionOptionIngredient)
					.createQueryBuilder('mealSubsectionOptionIngredient')
					.where('mealSubsectionOptionIngredient.uuid = :mealOptionUuid', {mealOptionUuid})
					.getOne();
				if (subsectionOptionIngredient) {
					const orderDetailMealOptionIngredient = new OrderDetailMealOptionIngredient();
					orderDetailMealOptionIngredient.optionIngredient = subsectionOptionIngredient;
					orderDetailMealOptionIngredient.orderDetailMeal = orderDetailMeal;
					await getRepository(OrderDetailMealOptionIngredient).save(orderDetailMealOptionIngredient);
				} else {
					const subsectionOptionProduct = await getRepository(MealSubsectionOptionProduct)
						.createQueryBuilder('mealSubsectionOptionProduct')
						.where('mealSubsectionOptionProduct.uuid = :mealOptionUuid', {mealOptionUuid})
						.getOne();

					if (subsectionOptionProduct) {
						const orderDetailMealOptionProduct = new OrderDetailMealOptionProduct();
						orderDetailMealOptionProduct.optionProduct = subsectionOptionProduct;
						orderDetailMealOptionProduct.orderDetailMeal = orderDetailMeal;
						await getRepository(OrderDetailMealOptionProduct).save(orderDetailMealOptionProduct);
					}
				}
			});
		} catch (err) {
			this.logger.error(err.message, err.stack);
			throw new BadRequestException();
		}
	}
}
