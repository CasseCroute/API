import {StoreCreatedMealEvent} from '@letseat/application/events/store-created-meal.event';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';

@EventsHandler(StoreCreatedMealEvent)
export class StoreCreatedMealHandler implements IEventHandler<StoreCreatedMealEvent> {
	handle(event: StoreCreatedMealEvent) {
		console.log(event);
	}
}
