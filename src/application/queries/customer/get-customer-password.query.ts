import {ICommand} from '@nestjs/cqrs';
import {Customer} from '@letseat/domains/customer/customer.entity';

export class GetCustomerPasswordQuery extends Customer implements ICommand {
	constructor(args: any) {
		super(args);
	}
}
