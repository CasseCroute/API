/* tslint:disable:no-unused */
import {Entity, Column, Unique, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';
import {Meal} from '@letseat/domains/meal/meal.entity';

@Unique(['reference'])
@Entity()
export class Product extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 16})
	reference: string;

	@Column({length: 13, nullable: true})
	ean13: string;

	@Column({length: 128})
	name: string;

	@Column('text', {nullable: true})
	description: string;

	@Column('decimal', {precision: 10, scale: 2, unsigned: true})
	price: number;

	@ManyToOne(type => Store, store => store.products, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	@OneToMany(type => ProductIngredient, productIngredient => productIngredient.product)
	ingredients: ProductIngredient[];

	@OneToMany(type => Meal, meal => meal.product)
	meals: Meal[];

	public static register(args: any): Product {
		return new Product(args);
	}

}
