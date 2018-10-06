import {ICommand} from '@nestjs/cqrs';
import {Resource} from '@letseat/domains/resource/resource';

export class GetResourceByUuidQuery extends Resource implements ICommand {
	readonly uuid: string;
	readonly entity: string;

	constructor(uuid: string, entity: string) {
		super();
		this.uuid = uuid;
		this.entity = entity;
	}
}
