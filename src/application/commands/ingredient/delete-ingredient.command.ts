import {ICommand} from '@nestjs/cqrs';

export class DeleteIngredientCommand implements ICommand {
	readonly storeUuid: string;
	readonly ingredientUuid: string;

	constructor(storeUuid: string, ingredientUuid: string) {
		this.storeUuid = storeUuid;
		this.ingredientUuid = ingredientUuid;
	}
}
