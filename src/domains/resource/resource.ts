import {Column, Generated, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn} from 'typeorm';
import {AggregateRoot} from '@nestjs/cqrs';

export class Resource extends AggregateRoot {
	constructor(args?: Resource) {
		super();
		return Object.assign(this, args);
	}

	@PrimaryGeneratedColumn({unsigned: true})
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@CreateDateColumn({name: 'created_at'})
	createdAt: Date;

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt: Date;

	public static register(args: any): Resource {
		return new Resource(args);
	}
}
