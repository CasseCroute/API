import {Entity, Column, Unique, OneToOne} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Cart} from '@letseat/domains/cart/cart.entity';

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

	public static register(args: any): Customer {
		return new Customer(args);
	}
}
