/* tslint:disable:no-unused */
import {Entity, Column, Unique, OneToMany, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Kiosk} from '@letseat/domains/kiosk/kiosk.entity';
import {Address} from '@letseat/domains/address/address.entity';
import {Stock} from '@letseat/domains/stock/stock.entity';

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

	@OneToMany(type => Kiosk, kiosk => kiosk.store, {cascade: ['insert']})
	kiosks: Kiosk[];

	@OneToMany(type => Stock, stock => stock.store, {cascade: ['insert']})
	stock: Stock[];

	@ManyToOne(type => Address, address => address.store, {cascade: ['insert'], eager: true})
	@JoinColumn({name: 'id_address'})
	address: Address;

	public static register(args: any): Store {
		return new Store(args);
	}
}
