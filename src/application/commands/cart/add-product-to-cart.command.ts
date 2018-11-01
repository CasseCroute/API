import {ICommand} from '@nestjs/cqrs';
import {AddProductToCartDto} from '@letseat/domains/cart/dtos/add-product-to-cart.dto';

export class AddProductToCartCommand implements ICommand {
	public readonly uuid: string;
	public readonly product: AddProductToCartDto;

	constructor(uuid: string, product: AddProductToCartDto) {
		this.uuid = uuid;
		this.product = product;
	}
}
