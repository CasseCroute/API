import {ICommand} from '@nestjs/cqrs';
import {Customer} from '@customer';

export class GetCustomerPasswordQuery extends Customer implements ICommand {
	constructor(args: any) {
		super(args);
	}
}
