import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetStoresQuery} from '../get-stores.query';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {InjectRepository} from '@nestjs/typeorm';

@CommandHandler(GetStoresQuery)
export class GetStoresHandler implements ICommandHandler<GetStoresQuery> {
	constructor(@InjectRepository(StoreRepository) private readonly storeRepository: StoreRepository) {
	}

	async execute(command: GetStoresQuery, resolve: (value?) => void) {
		try {
			resolve(await this.storeRepository.findAll());
			resolve(command);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
