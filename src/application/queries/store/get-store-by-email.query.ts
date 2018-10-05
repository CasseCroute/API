import {ICommand} from '@nestjs/cqrs';
import {Store} from '../../../domains/store/store.entity';

export class GetStoreByEmailQuery extends Store implements ICommand {
	readonly email: string;

	constructor(email: string) {
		super();
		this.email = email;
	}
}
