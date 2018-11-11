import {Entity, Column, Unique, OneToMany, ManyToOne, JoinColumn, ManyToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Kiosk} from '@letseat/domains/kiosk/kiosk.entity';
import {Address} from '@letseat/domains/address/address.entity';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {Section} from '@letseat/domains/section/section.entity';
import {Cuisine} from '@letseat/domains/cuisine/cuisine.entity';
import {Order} from '@letseat/domains/order/order.entity';

@Entity()
@Unique(['email'])
export class Store extends Resource {
	constructor(args?: Store) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	name: string;

	@Column({length: 256, select: false})
	password: string;

	@Column({length: 256})
	email: string;

	@Column({name: 'phone_number'})
	phoneNumber: string;

	@Column({length: 128})
	slug: string;

	@Column({name: 'image_url', length: 256, nullable: true})
	imageUrl?: string;

	@OneToMany(() => Kiosk, kiosk => kiosk.store, {cascade: ['insert']})
	kiosks: Kiosk[];

	@ManyToOne(() => Address, address => address.store, {cascade: ['insert'], eager: true})
	@JoinColumn({name: 'id_address'})
	address: Address;

	@OneToMany(() => Ingredient, ingredient => ingredient.store, {cascade: ['insert']})
	ingredients: Ingredient[];

	@OneToMany(() => Product, product => product.store, {cascade: ['insert']})
	products: Product[];

	@OneToMany(() => Meal, meal => meal.store, {cascade: ['insert']})
	meals: Meal[];

	@OneToMany(() => Section, section => section.store, {cascade: ['insert']})
	sections: Section[];

	@ManyToMany(() => Cuisine, cuisine => cuisine.stores)
	cuisines: Cuisine[];

	@OneToMany(() => Order, order => order.store)
	orders: Order[];

	public static register(args: any): Store {
		return new Store(args);
	}

}
