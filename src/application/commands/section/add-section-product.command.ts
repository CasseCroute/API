import {ICommand} from '@nestjs/cqrs';
import {AddSectionProductDto} from '@letseat/domains/section/dtos/add-section-product.dto';

export class AddSectionProductCommand implements ICommand {
	readonly storeUuid: string;
	readonly sectionUuid: string;
	readonly section: AddSectionProductDto;

	constructor(storeUuid: string, sectionUuid: string, section: AddSectionProductDto) {
		this.storeUuid = storeUuid;
		this.sectionUuid = sectionUuid;
		this.section = section;
	}
}
