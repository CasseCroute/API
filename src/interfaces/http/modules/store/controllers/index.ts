import {StoreController} from './store.controller';
import {StoreKiosksController} from './store-kiosks.controller';
import {CurrentStoreIngredientsController, StoreIngredientsController} from './store-ingredients.controller';
import {CurrentStoreProductsController, StoreProductsController} from './store.products.controller';
import {CurrentStoreMealsController} from './store.meals.controller';

export const StoreContollers = [
	StoreController,
	StoreKiosksController,
	CurrentStoreIngredientsController,
	StoreIngredientsController,
	CurrentStoreProductsController,
	StoreProductsController,
	CurrentStoreMealsController
];
export {
	StoreController,
	StoreKiosksController,
	CurrentStoreIngredientsController,
	StoreIngredientsController,
	CurrentStoreProductsController,
	StoreProductsController,
	CurrentStoreMealsController
};
