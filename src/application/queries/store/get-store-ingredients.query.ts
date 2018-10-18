import {ICommand} from '@nestjs/cqrs';

export class GetStoreIngredientsQuery implements ICommand {
	public readonly storeUuid: string;

	constructor(storeUuid: string) {
		this.storeUuid = storeUuid;
	}
}
