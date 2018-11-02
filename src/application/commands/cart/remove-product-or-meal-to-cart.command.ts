import {ICommand} from '@nestjs/cqrs';
import {RemoveProductOrMealToCartDto} from '@letseat/domains/cart/dtos/remove-product-or-meal-to-cart.dto';

export class RemoveProductOrMealToCartCommand implements ICommand {
	public readonly customerUuid: string;
	public readonly product: RemoveProductOrMealToCartDto;

	constructor(customerUuid: string, product: RemoveProductOrMealToCartDto) {
		this.customerUuid = customerUuid;
		this.product = product;
	}
}
