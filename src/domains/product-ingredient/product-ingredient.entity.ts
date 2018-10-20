/* tslint:disable:no-unused */
import {Entity, Column, Unique, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';

@Entity()
export class ProductIngredient extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({type: 'int', name: 'ingredient_quantity'})
	ingredientQuantity: number;

	@ManyToOne(type => Product, product => product.productIngredients, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_product'})
	product: Product;

	@ManyToOne(type => Ingredient, ingredient => ingredient.productIngredients, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_ingredient'})
	ingredient: Product;
}
