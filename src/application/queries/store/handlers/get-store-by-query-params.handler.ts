import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {NotFoundException} from '@nestjs/common';
import {GetStoresByQueryParamsQuery} from '../get-stores-by-query-params.query';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';
import {isObjectEmpty} from '@letseat/shared/utils';

@CommandHandler(GetStoresByQueryParamsQuery)
export class GetStoresByQueryParamsHandler implements ICommandHandler<GetStoresByQueryParamsQuery> {
	async execute(command: GetStoresByQueryParamsQuery, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);

		try {
			const stores = await storeRepository.findByQueryParams(store);
			return !isObjectEmpty(stores) ? resolve(stores) : resolve(Promise.reject(new NotFoundException('Resource not found')));
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
