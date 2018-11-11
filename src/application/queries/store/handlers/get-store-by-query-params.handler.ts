/* tslint:disable */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {NotFoundException} from '@nestjs/common';
import {GetStoresByQueryParamsQuery} from '@letseat/application/queries/store';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(GetStoresByQueryParamsQuery)
export class GetStoresByQueryParamsHandler implements ICommandHandler<GetStoresByQueryParamsQuery> {
	async execute(command: GetStoresByQueryParamsQuery, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);

		try {
			const stores = await storeRepository.findByQueryParams(store);
			return typeof stores !== 'undefined' ? resolve(stores) : resolve(Promise.reject(new NotFoundException('Resource not found')));
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
