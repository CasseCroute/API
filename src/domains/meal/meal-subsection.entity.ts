/* tslint:disable:no-unused */
import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsectionOption} from '@letseat/domains/meal/meal-subsection-option.entity';

@Entity()
export class MealSubsection extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	name: string;

	@Column('boolean', {name: 'is_required', default: false})
	isRequired: boolean;

	@Column('boolean', {name: 'allow_multiple_selections', default: false})
	allowMultipleSelections: boolean;

	@Column('int2', {name: 'min_selections_permitted', default: 1})
	minSelectionsPermitted: number;

	@Column('int2', {name: 'max_selections_permitted', default: 1})
	maxSelectionsPermitted: number;

	@ManyToOne(type => Meal, meal => meal.subsections, {nullable: false, cascade: ['insert'], onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_meal'})
	meal: Meal;

	@OneToMany(type => MealSubsectionOption, option => option.subsection, {nullable: false, cascade: ['insert'], onDelete: 'CASCADE'})
	options: MealSubsectionOption[];

	public static register(args: any): MealSubsection {
		return new MealSubsection(args);
	}
}
