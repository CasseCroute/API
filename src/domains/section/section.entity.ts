/* tslint:disable:no-unused */
import {Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {Product} from '@letseat/domains/product/product.entity';

@Entity()
export class Section extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	name: string;

	@ManyToOne(type => Store, store => store.sections, {cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	@ManyToMany(type => Product, product => product.sections)
	@JoinTable({
		name: 'sections_products', joinColumns: [{name: 'section_id'}], inverseJoinColumns: [{name: 'product_id'}]
	})
	products: Product[];

	@ManyToMany(type => Meal, meal => meal.sections)
	@JoinTable({
		name: 'sections_meals', joinColumns: [{name: 'section_id'}], inverseJoinColumns: [{name: 'meal_id'}]
	})
	meals: Meal[];

}
