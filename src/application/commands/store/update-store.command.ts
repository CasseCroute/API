import {ICommand} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';

export class UpdateStoreCommand extends Store implements ICommand {
	constructor(uuid: string, args: any) {
		super(args);
		this.uuid = uuid;
	}
}
