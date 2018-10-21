import {ICommand} from '@nestjs/cqrs';
import {UpdateProductDto} from '@letseat/domains/product/dtos/update-product.dto';

export class UpdateProductCommand implements ICommand {
	readonly storeUuid: string;
	readonly product: UpdateProductDto;
	readonly productUuid: string;

	constructor(storeUuid: string, productUuid: string, product: UpdateProductDto) {
		this.storeUuid = storeUuid;
		this.product = product;
		this.productUuid = productUuid;
	}
}
