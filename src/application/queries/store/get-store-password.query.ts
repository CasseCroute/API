import {ICommand} from '@nestjs/cqrs';
import {Store} from '../../../domains/store/store.entity';

export class GetStorePasswordQuery extends Store implements ICommand {
	constructor(args: any) {
		super(args);
	}
}
