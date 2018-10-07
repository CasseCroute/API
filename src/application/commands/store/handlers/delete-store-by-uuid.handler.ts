import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {DeleteStoreByUuidCommand} from '../delete-store-by-uuid.command';
import {NotFoundException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Customer} from '@letseat/domains/customer/customer.entity';

@CommandHandler(DeleteStoreByUuidCommand)
export class DeleteStoreByUuidHandler implements ICommandHandler<DeleteStoreByUuidCommand> {
	async execute(command: DeleteStoreByUuidCommand, resolve: (value?) => void) {
		const customer = Customer.register(command);
		try {
			await StoreRepository.deleteStoreByUuid(customer.uuid);
			resolve();
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
