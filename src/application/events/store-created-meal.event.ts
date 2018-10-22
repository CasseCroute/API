import {IEvent} from '@nestjs/cqrs';

export class StoreCreatedMealEvent implements IEvent {
	constructor(
		public readonly storeUuid: string,
		public readonly mealReference: string) {
	}
}
