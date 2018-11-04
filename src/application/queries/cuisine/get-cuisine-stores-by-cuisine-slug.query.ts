import {ICommand} from '@nestjs/cqrs';

export class GetCuisineStoresByCuisineSlugQuery implements ICommand {
	readonly cuisineSlug: string;

	constructor(cuisineSlug: string) {
		this.cuisineSlug = cuisineSlug;
	}

}
