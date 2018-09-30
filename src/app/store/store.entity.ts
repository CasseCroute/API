import {Entity, Column, PrimaryGeneratedColumn, Generated} from 'typeorm';
import {AggregateRoot} from '@nestjs/cqrs';

@Entity()
export class Store extends AggregateRoot {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({length: 128})
	name: string;

	@Column({length: 256})
	email: string;

	@Column({name: 'phone_number'})
	phoneNumber: string;

	@Column({length: 128})
	slug: string;

	@Column({name: 'image_url', length: 256, nullable: true})
	imageUrl?: string;

	constructor(name: string, email: string, phoneNumber: string, slug: string, imageUrl?: string) {
		super();
		this.name = name;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.slug = slug;
		this.imageUrl = imageUrl;
	}

	public static register(name: string, email: string, phoneNumber: string, slug: string, imageUrl: string | undefined): Store {
		return new Store(name, email, phoneNumber, slug, imageUrl);
	}
}
