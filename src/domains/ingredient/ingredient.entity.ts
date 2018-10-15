/* tslint:disable:no-unused */
import {Entity, Column, Unique, ManyToOne, JoinColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';

@Unique(['name'])
@Entity()
export class Kiosk extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	name: string;

	@Column({length: 128})
	measuring: number;
}
