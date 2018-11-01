import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {DeleteCustomerByUuidCommand} from '../delete-customer-by-uuid.command';
import {NotFoundException} from '@nestjs/common';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {getCustomRepository} from 'typeorm';

@CommandHandler(DeleteCustomerByUuidCommand)
export class DeleteCustomerByUuidHandler implements ICommandHandler<DeleteCustomerByUuidCommand> {
	async execute(command: DeleteCustomerByUuidCommand, resolve: (value?) => void) {
		const customer = Customer.register(command);
		const customerRepository = getCustomRepository(CustomerRepository);
		try {
			await customerRepository.deleteCustomerByUuid(customer.uuid);
			resolve();
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
