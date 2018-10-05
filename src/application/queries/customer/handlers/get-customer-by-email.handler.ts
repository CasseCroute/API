import {EventPublisher, ICommandHandler, CommandHandler, AggregateRoot} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetCustomerByEmailQuery} from '../get-customer-by-email.query';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {Customer} from '@letseat/domains/customer/customer.entity';

@CommandHandler(GetCustomerByEmailQuery)
export class GetCustomerByEmailHandler implements ICommandHandler<GetCustomerByEmailQuery> {
	constructor(private readonly repository: CustomerRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: GetCustomerByEmailQuery, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		const customer = Customer.register(command);

		try {
			const customerFound = this.publisher.mergeObjectContext(
				await customerRepository.findOneByEmail(customer.email) as AggregateRoot
			);
			resolve(customerFound);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
