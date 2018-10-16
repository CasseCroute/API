import {ICommand} from '@nestjs/cqrs';
import {CreateIngredientDto} from '@letseat/domains/ingredient/dtos';

export class CreateIngredientCommand implements ICommand {
	readonly storeUuid: string;
	readonly ingredient: CreateIngredientDto;

	constructor(storeUuid: string, ingredient: CreateIngredientDto) {
		this.storeUuid = storeUuid;
		this.ingredient = ingredient;
	}
}
