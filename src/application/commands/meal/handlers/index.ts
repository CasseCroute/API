import {CreateMealHandler} from './create-meal.handler';
import {UpdateMealHandler} from '@letseat/application/commands/meal/handlers/update-meal.handler';
import {DeleteMealHandler} from './delete-meal.handler';

export const MealCommandHandlers = [
	CreateMealHandler,
	DeleteMealHandler,
	UpdateMealHandler
];

export {
	CreateMealHandler,
	UpdateMealHandler,
	DeleteMealHandler
};
