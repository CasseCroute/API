import {ICommand} from '@nestjs/cqrs';

export class InsertStoreCommand implements ICommand {
	name: string;
	email: string;
	phoneNumber: string;
	slug: string;
	imageUrl?: string;

	constructor(name: string, email: string, phoneNumber: string, slug: string, imageUrl?: string) {
		this.name = name;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.slug = slug;
		this.imageUrl = imageUrl;
	}
}
