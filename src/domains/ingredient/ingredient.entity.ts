/* tslint:disable:no-unused */
import {Entity, Column, Unique, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Stock} from '@letseat/domains/stock/stock.entity';

@Unique(['name'])
@Entity()
export class Ingredient extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	name: string;

	@OneToMany(type => Stock, stock => stock.ingredient, {cascade: ['insert']})
	stock: Stock[];

}
