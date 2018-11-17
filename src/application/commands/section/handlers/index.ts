import {CreateSectionHandler} from '@letseat/application/commands/section/handlers/create-section.handler';
import {DeleteSectionHandler} from './delete-section.handler';
import {AddSectionProductHandler} from './add-section-product.handler';

export const SectionCommandHandlers = [
	CreateSectionHandler,
	DeleteSectionHandler,
	AddSectionProductHandler
];

export {
	CreateSectionHandler,
	DeleteSectionHandler,
	AddSectionProductHandler
};
