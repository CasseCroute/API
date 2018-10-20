import {StoreController} from './store.controller';
import {StoreKiosksController} from './store-kiosks.controller';
import {CurrentStoreIngredientsController, StoreIngredientsController} from './store-ingredients.controller';
import {CurrentStoreProductsController} from './store.products.controller';

export const StoreContollers = [
	StoreController,
	StoreKiosksController,
	CurrentStoreIngredientsController,
	StoreIngredientsController,
	CurrentStoreProductsController
];
export {
	StoreController,
	StoreKiosksController,
	CurrentStoreIngredientsController,
	StoreIngredientsController,
	CurrentStoreProductsController
};
