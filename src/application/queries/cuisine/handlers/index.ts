import {GetCuisinesHandler} from '@letseat/application/queries/cuisine/handlers/get-cuisines.handler';
import {GetCuisineStoresByCuisineSlugHandler} from '@letseat/application/queries/cuisine/handlers/get-cuisine-stores-by-cuisine-slug.handler';

export const CuisineQueryHandlers = [
	GetCuisinesHandler,
	GetCuisineStoresByCuisineSlugHandler
];

export {
	GetCuisinesHandler,
	GetCuisineStoresByCuisineSlugHandler
};
