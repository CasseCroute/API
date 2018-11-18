import {ICommand} from '@nestjs/cqrs';
import {RemoveSectionProductDto} from '@letseat/domains/section/dtos/remove-section-product.dto';

export class RemoveSectionProductCommand implements ICommand {
	readonly storeUuid: string;
	readonly sectionUuid: string;
	readonly section: RemoveSectionProductDto;

	constructor(storeUuid: string, sectionUuid: string, section: RemoveSectionProductDto) {
		this.storeUuid = storeUuid;
		this.sectionUuid = sectionUuid;
		this.section = section;
	}
}
