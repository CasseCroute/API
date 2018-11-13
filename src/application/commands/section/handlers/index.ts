import {CreateSectionHandler} from '@letseat/application/commands/section/handlers/create-section.handler';
import {DeleteSectionHandler} from './delete-section.handler';

export const SectionCommandHandlers = [
	CreateSectionHandler,
	DeleteSectionHandler
];

export {
	CreateSectionHandler,
	DeleteSectionHandler
};
