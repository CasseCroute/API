/* tslint:disable:no-unused */
import {Entity, Column, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';

@Entity()
export class Address extends Resource {
	constructor(args?: Address) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 256})
	street: string;

	@Column({length: 128, nullable: true})
	company: string;

	@Column({length: 128})
	city: string;

	@Column({length: 10, name: 'zip_code'})
	zipCode: string;

	@Column({length: 64})
	country: string;

	@Column({type: 'decimal', precision: 8, scale: 6, nullable: true})
	latitude: number;

	@Column({type: 'decimal', precision: 9, scale: 6, nullable: true})
	longitude: number;

	@OneToMany(type => Store, store => store.address)
	store: Store;

	public static register(args: any): Address {
		return new Address(args);
	}
}
