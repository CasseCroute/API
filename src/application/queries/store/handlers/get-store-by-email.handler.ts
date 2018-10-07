import {EventPublisher, ICommandHandler, CommandHandler, AggregateRoot} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreByEmailQuery} from '../get-store-by-email.query';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(GetStoreByEmailQuery)
export class GetStoreByEmailHandler implements ICommandHandler<GetStoreByEmailQuery> {
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: GetStoreByEmailQuery, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);

		try {
			const storeFound = this.publisher.mergeObjectContext(
				await storeRepository.findOneByEmail(store.email) as AggregateRoot
			);
			resolve(storeFound);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
