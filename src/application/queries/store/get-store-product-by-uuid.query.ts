import {ICommand} from '@nestjs/cqrs';

export class GetStoreProductByUuidQuery implements ICommand {
	public readonly storeUuid: string;
	public readonly productUuid: string;
	/**
	 * Determines if query is requested by a Store or not.
	 */
	public readonly isPublic?: boolean;

	constructor(storeUuid: string, productUuid: string, isPublic = false) {
		this.storeUuid = storeUuid;
		this.productUuid = productUuid;
		this.isPublic = isPublic;
	}
}
