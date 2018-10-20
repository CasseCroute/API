import {ICommand} from '@nestjs/cqrs';
import {UpdateIngredientDto} from '@letseat/domains/ingredient/dtos';

export class UpdateIngredientCommand implements ICommand {
	readonly storeUuid: string;
	readonly ingredient: UpdateIngredientDto;
	readonly ingredientUuid: string;

	constructor(storeUuid: string, ingredientUuid: string, ingredient: UpdateIngredientDto) {
		this.storeUuid = storeUuid;
		this.ingredient = ingredient;
		this.ingredientUuid = ingredientUuid;
	}
}
