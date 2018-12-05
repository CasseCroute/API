import {ICommand} from '@nestjs/cqrs';

/**
 * Dispatch a new SaveMealPictureUrl command.
 */
export class SaveMealPictureUrlCommand implements ICommand {
	public readonly storeUuid: string;
	public readonly mealUuid: string;
	public readonly imageUrl: string;

	constructor(storeUuid: string, mealUuid: string, imageUrl: string) {
		this.storeUuid = storeUuid;
		this.mealUuid = mealUuid;
		this.imageUrl = imageUrl;
	}
}
