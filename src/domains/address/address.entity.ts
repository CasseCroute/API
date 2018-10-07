/* tslint:disable:no-unused */
import {Entity, Column, Unique, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';

@Entity()
export class Address extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column()
	street: string;

	@Column({name: 'zip_code'})
	zipCode: string;

	@Column()
	city: string;

	@ManyToOne(type => Store, store => store.addresses, {cascade: ['insert']})
	@JoinColumn({name: 'id_store'})
	store: Store;
}
