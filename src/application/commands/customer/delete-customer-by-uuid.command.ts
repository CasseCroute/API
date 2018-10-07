import {ICommand} from '@nestjs/cqrs';
import {Customer} from '@letseat/domains/customer/customer.entity';

export class DeleteCustomerByUuidCommand extends Customer implements ICommand {
	readonly uuid: string;

	constructor(uuid: string) {
		super();
		this.uuid = uuid;
	}
}
