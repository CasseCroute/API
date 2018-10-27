import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';

import {getCustomRepository} from 'typeorm';
import {GetStoreByUuidQuery} from '../get-store-by-uuid.query';
import {NotFoundException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';

@CommandHandler(GetStoreByUuidQuery)
export class GetStoreByUuidHandler implements ICommandHandler<GetStoreByUuidQuery> {
	async execute(command: GetStoreByUuidQuery, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		try {
			const store = await storeRepository.findOneByUuid(command.uuid);
			resolve(store);
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
