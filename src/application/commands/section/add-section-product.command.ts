import {ICommand} from '@nestjs/cqrs';

export class AddSectionProductCommand implements ICommand {
	readonly storeUuid: string;
	readonly productUuid: string;

	constructor(storeUuid: string, productUuid: string) {
		this.storeUuid = storeUuid;
		this.productUuid = productUuid;
	}
}
