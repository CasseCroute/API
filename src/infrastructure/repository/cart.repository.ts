import {EntityRepository, getManager, getRepository, Repository} from 'typeorm';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {
	Cart,
	CartMeal,
	CartMealOptionIngredient,
	CartMealOptionProduct,
	CartProduct
} from '@letseat/domains/cart/cart.entity';
import {AddProductOrMealToCartDto} from '@letseat/domains/cart/dtos/add-product-or-meal-to-cart.dto';
import {Product} from '@letseat/domains/product/product.entity';
import {omitDeep} from '@letseat/shared/utils';
import {LoggerService} from '@letseat/infrastructure/services';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {NotFoundException} from '@nestjs/common';
import {MealSubsectionOption} from '@letseat/domains/meal/meal-subsection-option.entity';
import {RemoveProductOrMealToCartDto} from '@letseat/domains/cart/dtos/remove-product-or-meal-to-cart.dto';

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {
	private readonly selectRelations: string[] = [
		'products',
		'products.product',
		'meals',
		'meals.meal',
		'meals.ingredientOptions',
		'meals.productOptions',
		'store'
	];

	public async findOneByUuid(uuid: string, relations?: string[], selectId = false) {
		const cart = await this.findOneOrFail({where: {uuid}, relations});
		return selectId ? cart : omitDeep('id', cart);
	}

	public async createCart(customer: Customer, productDto: AddProductOrMealToCartDto): Promise<any> {
		try {
			const cart = new Cart();
			let product;
			if (productDto.productUuid) {
				product = await getManager()
					.findOneOrFail(Product, {where: {uuid: productDto.productUuid}, relations: ['store']});
			} else {
				product = await getManager()
					.findOneOrFail(Meal, {where: {uuid: productDto.mealUuid}, relations: ['store']});
			}
			cart.store = product.store;
			cart.customer = customer;
			customer.cart = cart;
			await getManager().save(customer);
			return this.save(cart).then(res => res);
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
	}

	public async addProductToCart(cart: Cart, product: AddProductOrMealToCartDto, customer: Customer) {
		if (product.productUuid) {
			return this.saveCartProduct(cart, product as any, customer);
		}
		return this.saveCartMeal(cart, product as any, customer);
	}

	public async saveCartProduct(cart: Cart, product: AddProductOrMealToCartDto & Product, customer: Customer) {
		try {
			const cartProduct = new CartProduct(product as any);
			const cartProductStore = await this.findCartProductStore(product.productUuid, cart);
			// If Customer tries to add a Product from another Store, destroy the old one and create a new one
			if (!cartProductStore) {
				return this.destroyCart(cart).then(async () => {
					await this.createCart(customer, product);
					return this.saveCartProduct(customer.cart, product, customer);
				});
			}
			cartProduct.product = cartProductStore;
			await getRepository(CartProduct).save(cartProduct);
			cart.products && cart.products.length > 0
				? cart.products.push(cartProduct) : cart.products = [cartProduct];
			await this.save(cart);
			return this.findOneByUuid(cart.uuid, this.selectRelations);
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
			throw new NotFoundException();
		}
	}

	public async saveCartMeal(cart: Cart, product: AddProductOrMealToCartDto & Product, customer: Customer) {
		try {
			const cartMeal = new CartMeal(product as any);
			const cartMealStore = await this.findCartMealStore(product.mealUuid, cart);
			// If Customer tries to add a Product from another Store, destroy the old one and create a new one
			if (!cartMealStore) {
				return this.destroyCart(cart).then(async () => {
					await this.createCart(customer, product);
					return this.saveCartMeal(customer.cart, product, customer);
				});
			}
			cartMeal.meal = cartMealStore;
			await getRepository(CartMeal).save(cartMeal);
			cart.meals && cart.meals.length > 0
				? cart.meals.push(cartMeal) : cart.meals = [cartMeal];

			if (product.optionUuids && product.optionUuids.length > 0) {
				await this.saveCartMealOptions(product.optionUuids, cartMeal);
			}

			await this.save(cart);
			return this.findOneByUuid(cart.uuid, this.selectRelations);
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
			throw new NotFoundException();
		}
	}

	public async destroyCart(cart: Cart) {
		return this.remove(cart);
	}

	public async saveCartMealOptions(mealOptionUuids: string[], cartMeal: CartMeal) {
		try {
			mealOptionUuids.forEach(async mealOptionUuid => {
				const option = await getRepository(MealSubsectionOption)
					.createQueryBuilder('mealSubsectionOption')
					.leftJoinAndSelect('mealSubsectionOption.ingredients', 'ingredient')
					.leftJoinAndSelect('mealSubsectionOption.products', 'product')
					.where('ingredient.uuid = :mealOptionUuid or product.uuid = :mealOptionUuid', {mealOptionUuid})
					.getOne();

				if (option && option.ingredients && option.ingredients.length > 0) {
					const cartMealOptionIngredient = new CartMealOptionIngredient();
					cartMealOptionIngredient.optionIngredient = option.ingredients[0];
					cartMealOptionIngredient.cartMeal = cartMeal;
					await getRepository(CartMealOptionIngredient).save(cartMealOptionIngredient);
				} else if (option && option.products && option.products.length > 0) {
					const cartMealOptionProduct = new CartMealOptionProduct();
					cartMealOptionProduct.optionProduct = option.products[0];
					cartMealOptionProduct.cartMeal = cartMeal;
					await getRepository(CartMealOptionProduct).save(cartMealOptionProduct);
				}
			});
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
		return;
	}

	public async removeProductToCart(cart: Cart, product: RemoveProductOrMealToCartDto) {
		try {
			if (product.productUuid) {
				await getRepository(CartProduct).delete({uuid: product.productUuid});
			} else if (product.mealUuid) {
				await getRepository(CartMeal).delete({uuid: product.mealUuid});
			}
			return this.findOneByUuid(cart.uuid, this.selectRelations);
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
	}

	public async findCartProductStore(productUuid: string, cart: Cart): Promise<any> {
		return getRepository(Product)
			.findOne({where: {uuid: productUuid, store: cart.store}});
	}

	public async findCartMealStore(mealUuid: string, cart: Cart): Promise<any> {
		return getRepository(Meal)
			.findOne({where: {uuid: mealUuid, store: cart.store}});
	}
}
