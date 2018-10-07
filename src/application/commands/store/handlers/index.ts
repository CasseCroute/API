import {CreateStoreHandler} from './create-store.handler';
import {CreateKioskHandler} from './create-kiosk.handler';
import {DeleteStoreByUuidHandler} from './delete-store-by-uuid.handler';

export const StoreCommandHandlers = [
	CreateStoreHandler,
	CreateKioskHandler,
	DeleteStoreByUuidHandler
];

export {
	CreateStoreHandler,
	CreateKioskHandler,
	DeleteStoreByUuidHandler
};
