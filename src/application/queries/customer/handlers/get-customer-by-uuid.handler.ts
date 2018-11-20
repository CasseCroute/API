import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetCustomerByUuidQuery} from '../get-customer-by-uuid.query';
import {NotFoundException} from '@nestjs/common';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';

@CommandHandler(GetCustomerByUuidQuery)
export class GetCustomerByUuidHandler implements ICommandHandler<GetCustomerByUuidQuery> {
	async execute(command: GetCustomerByUuidQuery, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		try {
			const customerFound	= await customerRepository.findOneByUuid(command.uuid);
			resolve(customerFound);
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
