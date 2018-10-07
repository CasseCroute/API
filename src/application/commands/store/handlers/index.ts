import {CreateStoreHandler} from './create-store.handler';
import {CreateKioskHandler} from './create-kiosk.handler';
import {UpdateStoreByUuidHandler} from '@letseat/application/commands/store/handlers/update-store-by-uuid.handler';

export const StoreCommandHandlers = [
	CreateStoreHandler,
	CreateKioskHandler,
	UpdateStoreByUuidHandler
];

export {
	CreateStoreHandler,
	CreateKioskHandler,
	UpdateStoreByUuidHandler
};
