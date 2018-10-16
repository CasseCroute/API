/* tslint:disable:no-unused */
import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {Store} from '@letseat/domains/store/store.entity';

@Entity()
export class Stock extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({name: 'ingredient_quantity'})
	ingredientQuantity: number;

	@ManyToOne(type => Store, store => store.stock, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	@ManyToOne(type => Ingredient, ingredient => ingredient.stock, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_ingredient'})
	ingredient: Ingredient;
}
