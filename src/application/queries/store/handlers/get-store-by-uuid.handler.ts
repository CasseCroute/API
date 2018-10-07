import {EventPublisher, ICommandHandler, CommandHandler, AggregateRoot} from '@nestjs/cqrs';

import {getCustomRepository} from 'typeorm';
import {GetStoreByUuidQuery} from '../get-store-by-uuid.query';
import {NotFoundException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(GetStoreByUuidQuery)
export class GetStoreByUuidHandler implements ICommandHandler<GetStoreByUuidQuery> {
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: GetStoreByUuidQuery, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);
		try {
			const storeFound = this.publisher.mergeObjectContext(
				await storeRepository.findOneByUuid(store.uuid) as AggregateRoot
			);
			resolve(storeFound);
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
