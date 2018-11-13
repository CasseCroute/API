import {GetStoreByEmailHandler} from './get-store-by-email.handler';
import {GetStorePasswordHandler} from './get-store-password.handler';
import {GetStoresHandler} from './get-stores.handler';
import {GetStoreByUuidHandler} from './get-store-by-uuid.handler';
import {GetStoresByQueryParamsHandler} from './get-store-by-query-params.handler';
import {GetStoreIngredientsHandler} from './get-store-ingredients.handler';
import {GetStoreIngredientByUuidHandler} from './get-store-ingredient-by-uuid.handler';
import {GetStoreProductsHandler} from './get-store-products.handler';
import {GetStoreProductByUuidHandler} from './get-store-product-by-uuid.handler';
import {GetStoreMealsHandler} from './get-store-meals.handler';
import {GetStoreSectionsHandler} from './get-store-sections.handler';
import {GetStoreSectionByUuidHandler} from '@letseat/application/queries/store/handlers/get-store-section-by-uuid.handler';
import {GetStoreOrdersHandler} from '@letseat/application/queries/store/handlers/get-store-orders.handler';

export const StoreQueryHandlers = [
	GetStoreByEmailHandler,
	GetStorePasswordHandler,
	GetStoresHandler,
	GetStoreByUuidHandler,
	GetStoresByQueryParamsHandler,
	GetStoreIngredientsHandler,
	GetStoreIngredientByUuidHandler,
	GetStoreProductsHandler,
	GetStoreProductByUuidHandler,
	GetStoreMealsHandler,
	GetStoreSectionsHandler,
	GetStoreSectionByUuidHandler,
	GetStoreOrdersHandler
];

export {
	GetStoreByEmailHandler,
	GetStorePasswordHandler,
	GetStoresHandler,
	GetStoreByUuidHandler,
	GetStoresByQueryParamsHandler,
	GetStoreIngredientsHandler,
	GetStoreIngredientByUuidHandler,
	GetStoreProductsHandler,
	GetStoreProductByUuidHandler,
	GetStoreMealsHandler,
	GetStoreSectionsHandler,
	GetStoreSectionByUuidHandler,
	GetStoreOrdersHandler
};
