import {CreateSectionHandler} from '@letseat/application/commands/section/handlers/create-section.handler';
import {DeleteSectionHandler} from './delete-section.handler';
import {AddSectionProductHandler} from './add-section-product.handler';
import {RemoveSectionProductHandler} from './remove-section-product.handler';
import {UpdateSectionHandler} from './update-section.handler';

export const SectionCommandHandlers = [
	CreateSectionHandler,
	DeleteSectionHandler,
	AddSectionProductHandler,
	RemoveSectionProductHandler,
	UpdateSectionHandler
];

export {
	CreateSectionHandler,
	DeleteSectionHandler,
	AddSectionProductHandler,
	RemoveSectionProductHandler,
	UpdateSectionHandler
};
