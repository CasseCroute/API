import {ICommand} from '@nestjs/cqrs';
import {CreateProductDto} from '@letseat/domains/product/dtos';

export class CreateProductCommand implements ICommand {
	readonly storeUuid: string;
	readonly product: CreateProductDto;

	constructor(storeUuid: string, product: CreateProductDto) {
		this.storeUuid = storeUuid;
		this.product = product;
	}
}
