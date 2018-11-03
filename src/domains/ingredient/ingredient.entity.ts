/* tslint:disable:no-unused */
import {Entity, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';

@Entity()
export class Ingredient extends Resource {
	constructor(args?: Ingredient) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	name: string;

	@Column({type: 'int', unsigned: true})
	quantity: number;

	@ManyToOne(type => Store, store => store.ingredients, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	@OneToMany(type => ProductIngredient, productIngredient => productIngredient.ingredient)
	products: ProductIngredient[];

	public static register(args: any): Ingredient {
		return new Ingredient(args);
	}
}
