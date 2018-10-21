/* tslint:disable:no-unused */
import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsection} from '@letseat/domains/meal/meal-subsection.entity';
import {MealSubsectionOption} from '@letseat/domains/meal/meal-subsection-option.entity';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {Product} from '@letseat/domains/product/product.entity';

@Entity()
export class MealSubsectionOptionProduct extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column('decimal', {default: 0, precision: 10, scale: 2, unsigned: true})
	price: number;

	@ManyToOne(type => MealSubsectionOption, option => option.products, {nullable: false, cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_meal_subsection_option'})
	option: MealSubsectionOption;

	@ManyToOne(type => Ingredient)
	@JoinColumn({name: 'id_product'})
	product: Product;

	public static register(args: any): MealSubsectionOptionProduct {
		return new MealSubsectionOptionProduct(args);
	}
}
