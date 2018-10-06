import {EventPublisher, ICommandHandler, CommandHandler, AggregateRoot} from '@nestjs/cqrs';

import {getCustomRepository} from 'typeorm';
import {GetCustomerByUuidQuery} from '../get-customer-by-uuid.query';
import {NotFoundException} from '@nestjs/common';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {Customer} from '@letseat/domains/customer/customer.entity';

@CommandHandler(GetCustomerByUuidQuery)
export class GetCustomerByUuidHandler implements ICommandHandler<GetCustomerByUuidQuery> {
	constructor(private readonly repository: CustomerRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: GetCustomerByUuidQuery, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		const customer = Customer.register(command);
		try {
			const customerFound = this.publisher.mergeObjectContext(
				await customerRepository.findOneByUuid(customer.uuid) as AggregateRoot
			);
			resolve(customerFound);
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
