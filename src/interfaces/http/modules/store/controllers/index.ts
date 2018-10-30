import {StoreController} from './store.controller';
import {StoreKiosksController} from './store-kiosks.controller';
import {CurrentStoreIngredientsController, StoreIngredientsController} from './store-ingredients.controller';
import {CurrentStoreProductsController, StoreProductsController} from './store.products.controller';
import {CurrentStoreMealsController} from './store.meals.controller';
import {CurrentStoreSectionsController} from '@letseat/interfaces/http/modules/store/controllers/store.sections.controller';

export const StoreContollers = [
	StoreController,
	StoreKiosksController,
	CurrentStoreIngredientsController,
	StoreIngredientsController,
	CurrentStoreProductsController,
	StoreProductsController,
	CurrentStoreMealsController,
	CurrentStoreSectionsController,
];
export {
	StoreController,
	StoreKiosksController,
	CurrentStoreIngredientsController,
	StoreIngredientsController,
	CurrentStoreProductsController,
	StoreProductsController,
	CurrentStoreMealsController,
	CurrentStoreSectionsController
};
