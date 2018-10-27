import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreByEmailQuery} from '../get-store-by-email.query';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(GetStoreByEmailQuery)
export class GetStoreByEmailHandler implements ICommandHandler<GetStoreByEmailQuery> {
	async execute(command: GetStoreByEmailQuery, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);

		try {
			const storeFound = await storeRepository.findOneByEmail(store.email);
			resolve(storeFound);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
