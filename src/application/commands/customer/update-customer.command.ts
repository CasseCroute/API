import {ICommand} from '@nestjs/cqrs';
import {Customer} from '@letseat/domains/customer/customer.entity';

export class UpdateCustomerCommand extends Customer implements ICommand {
	constructor(uuid: string, args: any) {
		super(args);
		this.uuid = uuid;
	}
}
