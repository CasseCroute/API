/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {UpdateStoreCommand} from '@letseat/application/commands/store';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(UpdateStoreCommand)
export class UpdateStoreByUuidHandler implements ICommandHandler<UpdateStoreCommand> {
	async execute(command: UpdateStoreCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);
		const {uuid, ...valuesToUpdate} = store;
		try {
			await storeRepository.updateStore(store.uuid, valuesToUpdate);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
