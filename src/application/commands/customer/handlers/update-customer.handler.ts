/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {UpdateCustomerCommand} from '@letseat/application/commands/customer';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
	async execute(command: UpdateCustomerCommand, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		const customer = Customer.register(command);
		const {uuid, ...valuesToUpdate} = customer;
		try {
			await customerRepository.updateCustomer(customer.uuid, valuesToUpdate);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
