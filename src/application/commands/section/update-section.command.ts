import {ICommand} from '@nestjs/cqrs';
import {UpdateSectionNameDto} from '@letseat/domains/section/dtos/update-section.dto.ts';

export class UpdateSectionCommand implements ICommand {
	readonly storeUuid: string;
	readonly sectionUuid: string;
	readonly section: UpdateSectionNameDto;

	constructor(storeUuid: string, sectionUuid: string, section: UpdateSectionNameDto) {
		this.storeUuid = storeUuid;
		this.sectionUuid = sectionUuid;
		this.section = section;
	}
}
