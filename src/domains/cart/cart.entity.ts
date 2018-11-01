/* tslint:disable */
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsectionOptionProduct} from '@letseat/domains/meal/meal-subsection-option-product.entity';

@Entity()
export class Cart extends Resource {
	constructor(args?: Cart) {
		super();
		return Object.assign(this, args);
	}

	@OneToOne(() => Customer, customer => customer.cart)
	@JoinColumn({name: 'id_customer'})
	customer: Customer;

	@ManyToOne(() => Store)
	@JoinColumn({name: 'id_store'})
	store: Store;

	@OneToMany(() => CartProduct, cartProduct => cartProduct.cart)
	products: CartProduct[];
}

@Entity()
export class CartProduct extends Resource {
	constructor(args?: CartProduct) {
		super();
		return Object.assign(this, args);
	}

	@Column('int2', {default: 1})
	quantity: number;

	@Column('text', {nullable: true})
	instructions?: string;

	@ManyToOne(() => Cart, cart => cart.products, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_cart'})
	cart: Cart;

	@ManyToOne(() => Product)
	@JoinColumn({name: 'id_product'})
	product: Product;
}

@Entity()
export class CartMeal extends Resource {
	constructor(args?: CartMeal) {
		super();
		return Object.assign(this, args);
	}

	@Column('int2', {default: 1})
	quantity: number;

	@Column('text', {nullable: true})
	instructions?: string;

	@ManyToOne(() => Cart, cart => cart.products, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_cart'})
	cart: Cart;

	@ManyToOne(() => Meal)
	@JoinColumn({name: 'id_meal'})
	meal: Meal;

	@OneToMany(() => CartMealOptionIngredient, ingredientOptions => ingredientOptions.cartMeal)
	ingredientOptions: CartMealOptionIngredient[];

	@OneToMany(() => CartMealOptionProduct, productOptions => productOptions.cartMeal)
	productOptions: CartMealOptionProduct[];
}

@Entity()
export class CartMealOptionIngredient extends Resource {
	constructor(args?: CartMealOptionIngredient) {
		super();
		return Object.assign(this, args);
	}

	@ManyToOne(() => CartMeal, cartMeal => cartMeal.ingredientOptions, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_cart_meal'})
	cartMeal: CartMeal;

	@ManyToOne(type => Product, {eager: true})
	@JoinColumn({name: 'id_product'})
	product: Product;
}

@Entity()
export class CartMealOptionProduct extends Resource {
	constructor(args?: CartMealOptionProduct) {
		super();
		return Object.assign(this, args);
	}

	@ManyToOne(() => CartMeal, cartMeal => cartMeal.productOptions, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_cart_meal'})
	cartMeal: CartMeal;

	@ManyToOne(type => MealSubsectionOptionProduct, {eager: true})
	@JoinColumn({name: 'id_meal_option_product'})
	optionProduct: MealSubsectionOptionProduct;
}
