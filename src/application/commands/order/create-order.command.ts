import {ICommand} from '@nestjs/cqrs';
import {CreateOrderDto} from '@letseat/domains/order/dtos/create-order.dto';

export class CreateOrderCommand implements ICommand {
	readonly customerUuid: string;
	readonly order: CreateOrderDto;

	constructor(customerUuid: string, order: CreateOrderDto) {
		this.customerUuid = customerUuid;
		this.order = order;
	}
}
