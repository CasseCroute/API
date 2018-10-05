import {ICommand} from '@nestjs/cqrs';
import {Resource} from '@letseat/domains/resource/resource';

export class GetResourceByUuidQuery extends Resource implements ICommand {
	readonly uuid: string;

	constructor(uuid: string) {
		super();
		this.uuid = uuid;
	}
}
