/* tslint:disable:no-unused */
import {Entity, Column, Unique, OneToMany} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Kiosk} from '@letseat/domains/kiosk/kiosk.entity';

@Entity()
@Unique(['email'])
export class Store extends Resource {
	constructor(args?: Store) {
		super();
		return Object.assign(this, args);
	}

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

	@OneToMany(type => Kiosk, kiosk => kiosk.store, {cascade: ['insert'], onDelete: 'CASCADE'})
	kiosks: Kiosk[];

	public static register(args: any): Store {
		return new Store(args);
	}
}
