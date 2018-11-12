import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {NotFoundException} from '@nestjs/common';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {GetCustomerOrdersQuery} from '@letseat/application/queries/customer';

@CommandHandler(GetCustomerOrdersQuery)
export class GetCustomerOrdersHandler implements ICommandHandler<GetCustomerOrdersQuery> {
	constructor(
		@InjectRepository(CustomerRepository)
		private readonly customerRepository: CustomerRepository) {
	}
	async execute(query: GetCustomerOrdersQuery, resolve: (value?) => void) {
		try {
			const customer	= await this.customerRepository.findCustomerOrders(query.customerUuid);
			if (customer) {
				resolve(customer.orders);
			} else {
				resolve(Promise.reject(new NotFoundException('Resource not found')));
			}
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
