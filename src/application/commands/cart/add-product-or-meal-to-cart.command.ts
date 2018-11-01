import {ICommand} from '@nestjs/cqrs';
import {AddProductOrMealToCartDto} from '@letseat/domains/cart/dtos/add-product-or-meal-to-cart.dto';

export class AddProductOrMealToCartCommand implements ICommand {
	public readonly uuid: string;
	public readonly product: AddProductOrMealToCartDto;

	constructor(uuid: string, product: AddProductOrMealToCartDto) {
		this.uuid = uuid;
		this.product = product;
	}
}
