/* tslint:disable:no-unused */
import {Entity, Column, Unique, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';

@Unique(['serialNumber'])
@Entity()
export class Kiosk extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({name: 'serial_number', length: 32})
	serialNumber: string;

	@ManyToOne(type => Store, store => store.kiosks, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;
}
