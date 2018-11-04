import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetStoresQuery} from '../get-stores.query';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';

@CommandHandler(GetStoresQuery)
export class GetStoresHandler implements ICommandHandler<GetStoresQuery> {
	constructor(private readonly repository: StoreRepository) {
	}

	async execute(command: GetStoresQuery, resolve: (value?) => void) {
		try {
			resolve(await this.repository.find());
			resolve(command);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
