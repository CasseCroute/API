import {StoreController} from './store.controller';
import {StoreKiosksController} from './store-kiosks.controller';
import {CurrentStoreIngredientsController, StoreIngredientsController} from './store-ingredients.controller';
import {CurrentStoreProductsController, StoreProductsController} from './store.products.controller';

export const StoreContollers = [
	StoreController,
	StoreKiosksController,
	CurrentStoreIngredientsController,
	StoreIngredientsController,
	CurrentStoreProductsController,
	StoreProductsController
];
export {
	StoreController,
	StoreKiosksController,
	CurrentStoreIngredientsController,
	StoreIngredientsController,
	CurrentStoreProductsController,
	StoreProductsController
};
