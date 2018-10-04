import {Entity, Column, PrimaryGeneratedColumn, Generated, Unique} from 'typeorm';
import {AggregateRoot} from '@nestjs/cqrs';

@Entity()
@Unique(['email'])
export class Customer extends AggregateRoot {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({length: 128})
	firstName: string;

	@Column({length: 128})
	lastName: string;

	@Column({length: 256, select: false})
	password: string;

	@Column({length: 256})
	email: string;

	@Column({name: 'phone_number'})
	phoneNumber: string;

	constructor(args?: Customer) {
		super();
		return Object.assign(this, args);
	}

	public static register(args: any): Customer {
		return new Customer(args);
	}
}
