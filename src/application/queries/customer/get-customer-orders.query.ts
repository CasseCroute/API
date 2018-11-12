import {ICommand} from '@nestjs/cqrs';

export class GetCustomerOrdersQuery implements ICommand {
	readonly customerUuid: string;

	constructor(customerUuid: string) {
		this.customerUuid = customerUuid;
	}
}
