/* tslint:disable:no-unused */
import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {StoreRepository} from '../../repository/store.repository';
import {GetStoresQuery} from '../get-stores.query';

@CommandHandler(GetStoresQuery)
export class GetStoresHandler implements ICommandHandler<GetStoresQuery> {
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: GetStoresQuery, resolve: (value?) => void) {
		try {
			const storesSelect = await this.repository.find();
			resolve(storesSelect.map(({id, ...columns}) => columns));
			resolve(command);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
