/* tslint:disable:no-unused */
import {Entity, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';

@Entity()
export class Ingredient extends Resource {
	constructor(args?: Ingredient) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	name: string;

	@Column()
	quantity: number;

	@ManyToOne(type => Store, store => store.ingredients, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	public static register(args: any): Ingredient {
		return new Ingredient(args);
	}
}
