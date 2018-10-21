/* tslint:disable:no-unused */
import {Entity, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {MealSubsection} from '@letseat/domains/meal/meal-subsection.entity';
import {MealSubsectionOptionIngredient} from '@letseat/domains/meal/meal-subsection-option-ingredient.entity';
import {MealSubsectionOptionProduct} from '@letseat/domains/meal/meal-subsection-option-product.entity';

@Entity()
export class MealSubsectionOption extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@ManyToOne(type => MealSubsection, subsection => subsection.options, {nullable: false, cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_meal_subsection'})
	subsection: MealSubsection;

	@OneToMany(type => MealSubsectionOptionIngredient, ingredientOption => ingredientOption.option, {nullable: false, cascade: ['insert'], onDelete: 'CASCADE'})
	ingredients: MealSubsectionOptionIngredient[];

	@OneToMany(type => MealSubsectionOptionProduct, productOption => productOption.option, {nullable: false, cascade: ['insert'], onDelete: 'CASCADE'})
	products: MealSubsectionOptionProduct[];

	public static register(args: any): MealSubsectionOption {
		return new MealSubsectionOption(args);
	}
}
