import {ICommand} from '@nestjs/cqrs';
import {Store} from '@store';

export class GetStorePasswordQuery extends Store implements ICommand {
	constructor(args: any) {
		super(args);
	}
}
