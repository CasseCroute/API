import {ICommand} from '@nestjs/cqrs';
import {CreateSectionDto} from '@letseat/domains/section/dtos/create-section.dto';

export class CreateSectionCommand implements ICommand {
	readonly storeUuid: string;
	readonly section: CreateSectionDto;

	constructor(storeUuid: string, section: CreateSectionDto) {
		this.storeUuid = storeUuid;
		this.section = section;
	}
}
