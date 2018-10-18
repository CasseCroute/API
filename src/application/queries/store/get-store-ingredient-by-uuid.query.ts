import {ICommand} from '@nestjs/cqrs';

export class GetStoreIngredientByUuidQuery implements ICommand {
	public readonly storeUuid: string;
	public readonly ingredientUuid: string;

	constructor(storeUuid: string, ingredientUuid: string) {
		this.storeUuid = storeUuid;
		this.ingredientUuid = ingredientUuid;
	}
}
