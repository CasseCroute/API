/* tslint:disable */
import {Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {EventObservable} from '@nestjs/cqrs';
import {StoreCreatedMealEvent} from '@letseat/application/events/store-created-meal.event';
import {map} from 'rxjs/operators';

@Injectable()
export class StoreMealsSagas {
	mealCreated = (events$: EventObservable<any>): Observable<any> => {
		return events$
			.ofType(StoreCreatedMealEvent)
			.pipe(
				map(event => {
					// return new DropAncientItemCommand(event.heroId, itemId);
					})
				);
	};
}
