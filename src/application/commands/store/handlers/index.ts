import {CreateStoreHandler} from './create-store.handler';
import {CreateKioskHandler} from './create-kiosk.handler';
import {DeleteStoreByUuidHandler} from './delete-store-by-uuid.handler';
import {UpdateStoreByUuidHandler} from '@letseat/application/commands/store/handlers/update-store-by-uuid.handler';
import {SaveStoreProfilePictureUrlHandler} from '@letseat/application/commands/store/handlers/save-store-profile-picture-url.handler';

export const StoreCommandHandlers = [
	CreateStoreHandler,
	CreateKioskHandler,
	DeleteStoreByUuidHandler,
	UpdateStoreByUuidHandler,
	SaveStoreProfilePictureUrlHandler
];

export {
	CreateStoreHandler,
	CreateKioskHandler,
	UpdateStoreByUuidHandler,
	DeleteStoreByUuidHandler,
	SaveStoreProfilePictureUrlHandler
};
