import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';

import {getCustomRepository} from 'typeorm';
import {DeleteCustomerByUuidQuery} from '../delete-customer-by-uuid.query';
import {NotFoundException} from '@nestjs/common';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {Customer} from '@letseat/domains/customer/customer.entity';

@CommandHandler(DeleteCustomerByUuidQuery)
export class DeleteCustomerByUuidHandler implements ICommandHandler<DeleteCustomerByUuidQuery> {
	async execute(command: DeleteCustomerByUuidQuery, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		const customer = Customer.register(command);
		try {
			await customerRepository.deleteCustomerByUuid(customer.uuid);
			resolve();
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
