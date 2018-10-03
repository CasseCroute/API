import {ICommand} from '@nestjs/cqrs';
import {Customer} from '@customer';

export class GetCustomerByEmailQuery extends Customer implements ICommand {
	readonly email: string;

	constructor(email: string) {
		super();
		this.email = email;
	}
}
