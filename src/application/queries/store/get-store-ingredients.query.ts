import {ICommand} from '@nestjs/cqrs';

export class GetStoreIngredientsQuery implements ICommand {
	public readonly storeUuid: string;
	public readonly isPublic?: boolean;

	constructor(storeUuid: string, isPublic = false) {
		this.storeUuid = storeUuid;
		this.isPublic = isPublic;
	}
}
