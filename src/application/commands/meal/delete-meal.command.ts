import {ICommand} from '@nestjs/cqrs';

export class DeleteMealCommand implements ICommand {
	readonly storeUuid: string;
	readonly mealUuid: string;

	constructor(storeUuid: string, mealUuid: string) {
		this.storeUuid = storeUuid;
		this.mealUuid = mealUuid;
	}
}
