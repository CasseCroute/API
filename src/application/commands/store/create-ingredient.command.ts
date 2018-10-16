import {ICommand} from '@nestjs/cqrs';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';

/**
 * Dispatch a new CreateIngredient command.
 */
export class CreateIngredientCommand implements ICommand {
	private readonly uuid: string;
	private readonly ingredient: Ingredient;

	constructor(uuid: string, ingredientCredentials: any) {
		this.uuid = uuid;
		this.ingredient = new Ingredient(ingredientCredentials);
	}
}
