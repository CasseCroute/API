import {GetStoreByEmailHandler} from './get-store-by-email.handler';
import {GetStorePasswordHandler} from './get-store-password.handler';
import {GetStoresHandler} from './get-stores.handler';
import {GetStoreByUuidHandler} from './get-store-by-uuid.handler';
import {GetStoresByQueryParamsHandler} from './get-store-by-query-params.handler';
import {GetStoreIngredientsHandler} from './get-store-ingredients.handler';
import {GetStoreIngredientByUuidHandler} from './get-store-ingredient-by-uuid.handler';
import {GetStoreProductsHandler} from '@letseat/application/queries/store/handlers/get-store-products.handler';

export const StoreQueryHandlers = [
	GetStoreByEmailHandler,
	GetStorePasswordHandler,
	GetStoresHandler,
	GetStoreByUuidHandler,
	GetStoresByQueryParamsHandler,
	GetStoreIngredientsHandler,
	GetStoreIngredientByUuidHandler,
	GetStoreProductsHandler
];

export {
	GetStoreByEmailHandler,
	GetStorePasswordHandler,
	GetStoresHandler,
	GetStoreByUuidHandler,
	GetStoresByQueryParamsHandler,
	GetStoreIngredientsHandler,
	GetStoreIngredientByUuidHandler,
	GetStoreProductsHandler
};
