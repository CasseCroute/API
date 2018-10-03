import {ICommand} from '@nestjs/cqrs';
import {Store} from '@store';

export class GetStoreByEmailQuery extends Store implements ICommand {
	readonly email: string;

	constructor(email: string) {
		super();
		this.email = email;
	}
}
