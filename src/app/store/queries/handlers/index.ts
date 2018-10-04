import {GetStoreByEmailHandler} from './get-store-by-email.handler';
import {GetStorePasswordHandler} from './get-store-password.handler';
import {GetStoresHandler} from './get-stores.handler';
import {GetStoreByUuidHandler} from './get-store-by-uuid.handler';

export const StoreQueryHandlers = [
	GetStoreByEmailHandler,
	GetStorePasswordHandler,
	GetStoresHandler,
	GetStoreByUuidHandler
];
