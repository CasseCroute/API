import {ICommand} from '@nestjs/cqrs';

/**
 * Dispatch a new SaveStoreProfilePictureUrl command.
 */
export class SaveStoreProfilePictureUrlCommand implements ICommand {
	public readonly storeUuid: string;
	public readonly imageUrl: string;

	constructor(storeUuid: string, imageUrl: string) {
		this.storeUuid = storeUuid;
		this.imageUrl = imageUrl;
	}
}
