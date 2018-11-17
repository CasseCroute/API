import {ICommand} from '@nestjs/cqrs';
import {AddSectionProductDto} from '@letseat/domains/section/dtos/add-section-product.dto';

export class AddSectionProductCommand implements ICommand {
	readonly storeUuid: string;
	readonly section: AddSectionProductDto;

	constructor(storeUuid: string, section: AddSectionProductDto) {
		this.storeUuid = storeUuid;
		this.section = section;
	}
}
