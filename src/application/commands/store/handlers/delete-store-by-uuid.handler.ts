import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {DeleteStoreByUuidCommand} from '../delete-store-by-uuid.command';
import {NotFoundException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(DeleteStoreByUuidCommand)
export class DeleteStoreByUuidHandler implements ICommandHandler<DeleteStoreByUuidCommand> {
	async execute(command: DeleteStoreByUuidCommand, resolve: (value?) => void) {
		const store = Store.register(command);
		try {
			await StoreRepository.deleteStoreByUuid(store.uuid);
			resolve();
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
