import {CreateStoreHandler} from './create-store.handler';
import {CreateKioskHandler} from './create-kiosk.handler';
import {DeleteStoreByUuidHandler} from './delete-store-by-uuid.handler';
import {UpdateStoreByUuidHandler} from '@letseat/application/commands/store/handlers/update-store-by-uuid.handler';
import {CreateIngredientHandler} from './create-ingredient.handler';
export const StoreCommandHandlers = [
	CreateStoreHandler,
	CreateKioskHandler,
	DeleteStoreByUuidHandler,
	UpdateStoreByUuidHandler,
	CreateIngredientHandler
];

export {
	CreateStoreHandler,
	CreateKioskHandler,
	UpdateStoreByUuidHandler,
	DeleteStoreByUuidHandler,
	CreateIngredientHandler
};
