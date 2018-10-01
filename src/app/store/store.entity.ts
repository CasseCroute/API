import {Entity, Column, PrimaryGeneratedColumn, Generated, Unique} from 'typeorm';
import {AggregateRoot} from '@nestjs/cqrs';

@Entity()
@Unique(['email'])
export class Store extends AggregateRoot {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({length: 128})
	name: string;

	@Column({length: 256, select: false})
	password: string;

	@Column({length: 256})
	email: string;

	@Column({name: 'phone_number'})
	phoneNumber: string;

	@Column({length: 128})
	slug: string;

	@Column({name: 'image_url', length: 256, nullable: true})
	imageUrl?: string;

	constructor(args?: Store) {
		super();
		return Object.assign(this, args);
	}

	public static register(args: any): Store {
		return new Store(args);
	}
}
