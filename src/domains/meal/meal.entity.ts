/* tslint:disable:no-unused */
import {Entity, Column, Unique, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';
import {Product} from '@letseat/domains/product/product.entity';

@Unique(['reference'])
@Entity()
export class Meal extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 16})
	reference: string;

	@Column({length: 128})
	name: string;

	@Column('text', {nullable: true})
	description: string;

	@Column('decimal', {precision: 10, scale: 2, unsigned: true})
	price: number;

	@Column('int', {default: 1, name: 'product_quantity', unsigned: true})
	productQuantity: number;

	@ManyToOne(type => Store, store => store.meals, {nullable: false, cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	@ManyToOne(type => Product, product => product.meals, {nullable: false, cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_product'})
	product: Product;

	public static register(args: any): Meal {
		return new Meal(args);
	}
}
