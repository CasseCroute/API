/* tslint:disable:no-unused */
import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetStoresQuery} from '../get-stores.query';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {omitDeep} from '@letseat/shared/utils';

@CommandHandler(GetStoresQuery)
export class GetStoresHandler implements ICommandHandler<GetStoresQuery> {
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: GetStoresQuery, resolve: (value?) => void) {
		try {
			const storesSelect = await this.repository.find();
			resolve(omitDeep('id', storesSelect));
			resolve(command);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
