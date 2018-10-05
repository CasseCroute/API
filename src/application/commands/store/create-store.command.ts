import {ICommand} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';

export class CreateStoreCommand extends Store implements ICommand {
	constructor(args: any) {
		super(args);
	}
}
