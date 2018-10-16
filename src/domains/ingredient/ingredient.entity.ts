/* tslint:disable:no-unused */
import {Entity, Column, Unique, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';

@Unique(['name'])
@Entity()
export class Ingredient extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	name: string;

	@Column()
	quantity: number;

	@ManyToOne(type => Store, store => store.ingredient, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

}
