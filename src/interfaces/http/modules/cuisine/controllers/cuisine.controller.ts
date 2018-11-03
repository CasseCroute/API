import {Controller, Get, HttpCode, Param, Post} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {Cuisine} from '@letseat/domains/cuisine/cuisine.entity';
import {Store} from '@letseat/domains/store/store.entity';
import {GetCuisinesQuery, GetCuisineStoresByCuisineSlugQuery} from '@letseat/application/queries/cuisine';

@Controller('cuisines')
export class CuisineController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Get()
	public async getCuisines(): Promise<Cuisine[] | Cuisine> {
		return this.commandBus.execute(new GetCuisinesQuery());
	}

	@Post(':cuisineSlug')
	@HttpCode(200)
	public async getCuisineStoresByCuisineSlug(@Param('cuisineSlug') cuisineSlug: string): Promise<Store[] | Store> {
		return this.commandBus.execute(new GetCuisineStoresByCuisineSlugQuery(cuisineSlug));
	}
}
