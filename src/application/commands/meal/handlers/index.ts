import {CreateMealHandler} from './create-meal.handler';
import {UpdateMealHandler} from '@letseat/application/commands/meal/handlers/update-meal.handler';

export const MealCommandHandlers = [
	CreateMealHandler,
	UpdateMealHandler
];

export {
	CreateMealHandler,
	UpdateMealHandler
};
