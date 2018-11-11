/* tslint:disable */
import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsectionOptionProduct} from '@letseat/domains/meal/meal-subsection-option-product.entity';
import {MealSubsectionOptionIngredient} from '@letseat/domains/meal/meal-subsection-option-ingredient.entity';

@Entity()
export class Order extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 16})
	reference: string;

	@Column('decimal', {precision: 10, scale: 2, unsigned: true, name: 'total_paid'})
	totalPaid: number;

	@Column('decimal', {precision: 10, scale: 2, unsigned: true, name: 'delivery_fees', default: 0})
	deliveryFees: number;

	@Column({length: 128, name: 'first_name'})
	firstName: string;

	@Column({length: 128, name: 'last_name'})
	lastName: string;

	@Column({length: 258, name: 'delivery_address'})
	deliveryAddress: string;

	@Column({length: 256})
	email: string;

	@Column('boolean', {name: 'is_guest', default: false})
	isGuest: boolean;

	@Column({name: 'phone_number'})
	phoneNumber: string;

	@Column('text', {nullable: true, name: 'delivery_note'})
	deliveryNote?: string;

	@Column('boolean', {name: 'is_take_away', default: false})
	isTakeAway: boolean;

	@Column('boolean', {name: 'is_eat_in', default: false})
	isEatIn: boolean;

	@Column('boolean', {name: 'is_delivery', default: false})
	isDelivery: boolean;

	@ManyToOne(() => Customer, customer => customer.orders, {onDelete: 'CASCADE', nullable: true})
	@JoinColumn({name: 'id_customer'})
	customer: Customer;

	@ManyToOne(() => Store, store => store.orders, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	@OneToMany(() => OrderDetailProduct || OrderDetailMeal, detail => detail.order)
	details: OrderDetailProduct[] | OrderDetailMeal[];
}

@Entity()
export class OrderDetailProduct extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({type: 'smallint', name: 'quantity', unsigned: true})
	quantity: number;

	@Column('decimal', {precision: 10, scale: 2, unsigned: true})
	price: number;

	@Column('text', {nullable: true})
	instructions?: string;

	@ManyToOne(() => Order, order => order.details, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_order'})
	order: Order;

	@ManyToOne(() => Product, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_product'})
	product: Product;
}

@Entity()
export class OrderDetailMeal extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({type: 'smallint', name: 'quantity', unsigned: true})
	quantity: number;

	@Column('decimal', {precision: 10, scale: 2, unsigned: true})
	price: number;

	@Column('text', {nullable: true})
	instructions?: string;

	@ManyToOne(() => Order, order => order.details, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_order'})
	order: Order;

	@ManyToOne(() => Meal, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_meal'})
	meal: Meal;

	@OneToMany(() => OrderDetailMealOptionIngredient, ingredientOptions => ingredientOptions.orderDetailMeal)
	ingredientOptions: OrderDetailMealOptionIngredient[];

	@OneToMany(() => OrderDetailMealOptionProduct, productOptions => productOptions.orderDetailMeal)
	productOptions: OrderDetailMealOptionProduct[];
}

@Entity()
export class OrderDetailMealOptionProduct extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@ManyToOne(() => OrderDetailMeal, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_order_detail_meal'})
	orderDetailMeal: OrderDetailMeal;

	@ManyToOne(() => MealSubsectionOptionProduct, {eager: true})
	@JoinColumn({name: 'id_meal_option_product'})
	optionProduct: MealSubsectionOptionProduct;
}

@Entity()
export class OrderDetailMealOptionIngredient extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@ManyToOne(() => OrderDetailMeal, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_order_detail_meal'})
	orderDetailMeal: OrderDetailMeal;

	@ManyToOne(() => MealSubsectionOptionIngredient, {eager: true})
	@JoinColumn({name: 'id_meal_option_ingredient'})
	optionIngredient: MealSubsectionOptionIngredient;
}
