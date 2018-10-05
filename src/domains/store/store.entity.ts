import {Entity, Column, Unique} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';

@Entity()
@Unique(['email'])
export class Store extends Resource {
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
