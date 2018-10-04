import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CustomerRepository} from '../../repository/customer.repository';
import {Customer} from '../../';
import {getCustomRepository} from 'typeorm';
import {GetCustomerPasswordQuery} from '../get-customer-password.query';

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
