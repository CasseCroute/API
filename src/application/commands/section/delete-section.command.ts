import {ICommand} from '@nestjs/cqrs';

export class DeleteSectionCommand implements ICommand {
	readonly storeUuid: string;
	readonly sectionUuid: string;

	constructor(storeUuid: string, sectionUuid: string) {
		this.storeUuid = storeUuid;
		this.sectionUuid = sectionUuid;
	}
}
