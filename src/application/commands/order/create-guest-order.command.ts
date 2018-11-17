import {ICommand} from '@nestjs/cqrs';
import {AddProductOrMealToCartDto} from '@letseat/domains/cart/dtos';

export class CreateGuestOrderCommand implements ICommand {
	readonly guestOrder: AddProductOrMealToCartDto[];
	readonly storeUuid: string;

	constructor(guestOrder: AddProductOrMealToCartDto[], storeUuid: string) {
		this.guestOrder = guestOrder;
		this.storeUuid = storeUuid;
	}
}
