import {ICommand} from '@nestjs/cqrs';

export class GetStoreSectionByUuidQuery implements ICommand {
	public readonly storeUuid: string;
	public readonly sectionUuid: string;
	/**
	 * Determines if query is requested by a Store or not.
	 */
	public readonly isPublic?: boolean;

	constructor(storeUuid: string, sectionUuid: string, isPublic = false) {
		this.storeUuid = storeUuid;
		this.sectionUuid = sectionUuid;
		this.isPublic = isPublic;
	}
}
