import {Entity, Column, Unique, OneToOne, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Cart} from '@letseat/domains/cart/cart.entity';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';
import {Order} from '@letseat/domains/order/order.entity';

@Entity()
@Unique(['email'])
export class Customer extends Resource {
	constructor(args?: Customer) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	firstName: string;

	@Column({length: 128})
	lastName: string;

	@Column({length: 256, select: false})
	password: string;

	@Column({length: 256})
	email: string;

	@Column({name: 'phone_number'})
	phoneNumber: string;

	@OneToOne(() => Cart, cart => cart.customer)
	cart: Cart;

	@OneToMany(() => Order, order => order.customer)
	orders: Order[];

	public static register(args: any): Customer {
		return new Customer(args);
	}
}
