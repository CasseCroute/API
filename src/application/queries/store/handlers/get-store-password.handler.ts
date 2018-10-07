import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStorePasswordQuery} from '../get-store-password.query';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(GetStorePasswordQuery)
export class GetStorePasswordHandler implements ICommandHandler<GetStorePasswordQuery> {
	async execute(command: GetStorePasswordQuery, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);

		try {
			resolve(await storeRepository.getPassword(store));
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
