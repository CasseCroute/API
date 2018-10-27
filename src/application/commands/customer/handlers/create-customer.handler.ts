import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CreateCustomerCommand} from '../create-customer.command';
import {getCustomRepository, Repository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {Customer} from '@letseat/domains/customer/customer.entity';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
	async execute(command: CreateCustomerCommand, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		command.password = await CryptographerService.hashPassword(command.password);
		const customer = Customer.register(command);

		try {
			const customerSaved = await customerRepository.saveCustomer(customer, new Repository<Customer>());
			delete customerSaved.password;
			const jwt = AuthService.createToken<Customer>(customerSaved);
			resolve(jwt);
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
