import {ICommand} from '@nestjs/cqrs';

/**
 * Dispatch a new SaveProductPictureUrl command.
 */
export class SaveProductPictureUrlCommand implements ICommand {
	public readonly storeUuid: string;
	public readonly productUuid: string;
	public readonly imageUrl: string;

	constructor(storeUuid: string, productUuid: string, imageUrl: string) {
		this.storeUuid = storeUuid;
		this.productUuid = productUuid;
		this.imageUrl = imageUrl;
	}
}
