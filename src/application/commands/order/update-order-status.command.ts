import {ICommand} from '@nestjs/cqrs';
import {UpdateOrderStatusDto} from '@letseat/domains/order/dtos/update-order-status.dto';

export class UpdateOrderStatusCommand implements ICommand {
	readonly storeUuid: string;
	readonly orderUuid: string;
	readonly order: UpdateOrderStatusDto;

	constructor(storeUuid: string, orderUuid: string, order: UpdateOrderStatusDto) {
		this.storeUuid = storeUuid;
		this.orderUuid = orderUuid;
		this.order = order;
	}
}
