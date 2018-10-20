import {CreateIngredientHandler} from './create-ingredient.handler';
import {UpdateIngredientHandler} from './update-ingredient.handler';
import {DeleteIngredientByUuidHandler} from '@letseat/application/commands/ingredient/handlers/delete-ingredient-by-uuid.handler';

export const IngredientCommandHandlers = [
	CreateIngredientHandler,
	UpdateIngredientHandler,
	DeleteIngredientByUuidHandler
];

export {
	CreateIngredientHandler,
	UpdateIngredientHandler,
	DeleteIngredientByUuidHandler
};
