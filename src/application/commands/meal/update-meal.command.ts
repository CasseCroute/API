import {ICommand} from '@nestjs/cqrs';
import {UpdateMealDto} from '@letseat/domains/meal/dtos';

export class UpdateMealCommand implements ICommand {
	readonly storeUuid: string;
	readonly meal: UpdateMealDto;
	readonly mealUuid: string;

	constructor(storeUuid: string, mealUuid: string, meal: UpdateMealDto) {
		this.storeUuid = storeUuid;
		this.meal = meal;
		this.mealUuid = mealUuid;
	}
}
