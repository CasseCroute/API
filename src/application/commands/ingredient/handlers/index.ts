import {CreateIngredientHandler} from './create-ingredient.handler';
import {UpdateIngredientHandler} from './update-ingredient.handler';
import {DeleteIngredientHandler} from './delete-ingredient.handler';

export const IngredientCommandHandlers = [
	CreateIngredientHandler,
	UpdateIngredientHandler,
	DeleteIngredientHandler
]

export {
	CreateIngredientHandler,
	UpdateIngredientHandler,
	DeleteIngredientHandler
};
