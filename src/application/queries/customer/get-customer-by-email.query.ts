import {ICommand} from '@nestjs/cqrs';
import {Customer} from '@letseat/domains/customer/customer.entity';

export class GetCustomerByEmailQuery extends Customer implements ICommand {
	readonly email: string;

	constructor(email: string) {
		super();
		this.email = email;
	}
}
