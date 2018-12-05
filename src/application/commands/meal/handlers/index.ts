import {CreateMealHandler} from './create-meal.handler';
import {UpdateMealHandler} from '@letseat/application/commands/meal/handlers/update-meal.handler';
import {DeleteMealHandler} from './delete-meal.handler';
import {SaveMealPictureUrlHandler} from '@letseat/application/commands/meal/handlers/save-meal-picture-url.handler';

export const MealCommandHandlers = [
	CreateMealHandler,
	DeleteMealHandler,
	UpdateMealHandler,
	SaveMealPictureUrlHandler
];

export {
	CreateMealHandler,
	UpdateMealHandler,
	DeleteMealHandler,
	SaveMealPictureUrlHandler
};
