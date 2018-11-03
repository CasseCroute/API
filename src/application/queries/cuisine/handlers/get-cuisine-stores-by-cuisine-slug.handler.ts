/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {GetCuisineStoresByCuisineSlugQuery} from '@letseat/application/queries/cuisine';
import {CuisineRepository} from '@letseat/infrastructure/repository/cuisine.repository';

@CommandHandler(GetCuisineStoresByCuisineSlugQuery)
export class GetCuisineStoresByCuisineSlugHandler implements ICommandHandler<GetCuisineStoresByCuisineSlugQuery> {
	constructor(@InjectRepository(CuisineRepository) private readonly cuisineRepository: CuisineRepository) {
	}

	async execute(query: GetCuisineStoresByCuisineSlugQuery, resolve: (value?) => void) {
		try {
			resolve(await this.cuisineRepository.findCuisineStoresByCuisineSlug(query.cuisineSlug));
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
