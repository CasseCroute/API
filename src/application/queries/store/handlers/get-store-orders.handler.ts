import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetStoreOrdersQuery} from '@letseat/application/queries/store';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {InjectRepository} from '@nestjs/typeorm';

@CommandHandler(GetStoreOrdersQuery)
export class GetStoreOrdersHandler implements ICommandHandler<GetStoreOrdersQuery> {
	constructor(@InjectRepository(StoreRepository) private readonly storeRepository: StoreRepository) {
	}
	async execute(command: GetStoreOrdersQuery, resolve: (value?) => void) {
		try {
			const orders = await this.storeRepository.findStoreOrders(command.storeUuid);
			resolve(orders);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
