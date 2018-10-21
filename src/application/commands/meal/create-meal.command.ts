import {ICommand} from '@nestjs/cqrs';
import {CreateMealDto} from '@letseat/domains/meal/dtos/create-meal.dto';

export class CreateMealCommand implements ICommand {
	readonly storeUuid: string;
	readonly meal: CreateMealDto;

	constructor(storeUuid: string, meal: CreateMealDto) {
		this.storeUuid = storeUuid;
		this.meal = meal;
	}
}
