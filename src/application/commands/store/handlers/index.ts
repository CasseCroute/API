import {CreateStoreHandler} from './create-store.handler';
import {CreateKioskHandler} from './create-kiosk.handler';

export const StoreCommandHandlers = [
	CreateStoreHandler,
	CreateKioskHandler
];

export {
	CreateStoreHandler,
	CreateKioskHandler
};
