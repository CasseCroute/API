/* tslint:disable:no-unused */
import {Entity, Column, Unique, ManyToOne, JoinColumn, OneToMany, ManyToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {Section} from '@letseat/domains/section/section.entity';
import {Cuisine} from '@letseat/domains/cuisine/cuisine.entity';

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

	@Column({name: 'image_url', length: 256, nullable: true})
	imageUrl?: string;

	@ManyToOne(type => Store, store => store.products, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	@OneToMany(type => ProductIngredient, productIngredient => productIngredient.product)
	ingredients: ProductIngredient[];

	@OneToMany(type => Meal, meal => meal.product)
	meals: Meal[];

	@ManyToMany(type => Section, section => section.products)
	sections: Section[];

	@ManyToOne(() => Cuisine, cuisine => cuisine.stores)
	@JoinColumn({name: 'id_cuisine'})
	cuisine: Cuisine;

	public static register(args: any): Product {
		return new Product(args);
	}

}
