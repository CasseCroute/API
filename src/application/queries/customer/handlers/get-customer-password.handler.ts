import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetCustomerPasswordQuery} from '../get-customer-password.query';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {Customer} from '@letseat/domains/customer/customer.entity';

@CommandHandler(GetCustomerPasswordQuery)
export class GetCustomerPasswordHandler implements ICommandHandler<GetCustomerPasswordQuery> {
	async execute(command: GetCustomerPasswordQuery, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		const customer = Customer.register(command);

		try {
			resolve(await customerRepository.getPassword(customer));
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
