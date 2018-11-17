import {ICommand} from '@nestjs/cqrs';
import {CreateGuestOrderDto} from '@letseat/domains/order/dtos/create-order.dto';

export class CreateGuestOrderCommand implements ICommand {
	readonly guestOrder: CreateGuestOrderDto;
	readonly storeUuid: string;

	constructor(guestOrder: CreateGuestOrderDto, storeUuid: string) {
		this.guestOrder = guestOrder;
		this.storeUuid = storeUuid;
	}
}
