import {ICommand} from '@nestjs/cqrs';
import {Store} from '@store';

export class GetStoreByUuidQuery extends Store implements ICommand {
	readonly uuid: string;

	constructor(uuid: string) {
		super();
		this.uuid = uuid;
	}
}
