import {ICommand} from '@nestjs/cqrs';

export class GetStoreIngredientByUuidQuery implements ICommand {
	public readonly storeUuid: string;
	public readonly ingredientUuid: string;
	/**
	 * Determines if query is requested by a Store or not.
	 */
	public readonly isPublic?: boolean;

	constructor(storeUuid: string, ingredientUuid: string, isPublic = false) {
		this.storeUuid = storeUuid;
		this.ingredientUuid = ingredientUuid;
		this.isPublic = isPublic;
	}
}
