import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CreateCustomerCommand} from '../create-customer.command';
import {CustomerRepository} from '../../repository/customer.repository';
import {Customer} from '@customer';
import {getCustomRepository, Repository} from 'typeorm';
import {AuthStoreService, CryptographerService} from '@auth';
import {BadRequestException} from '@nestjs/common';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
	constructor(private readonly repository: CustomerRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: CreateCustomerCommand, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		command.password = await CryptographerService.hashPassword(command.password);
		const customer = Customer.register(command);

		try {
			const customerSaved = this.publisher.mergeObjectContext(
				await customerRepository.saveCustomer(customer, new Repository<Customer>())
			);
			delete customerSaved.password;
			const jwt = AuthStoreService.createToken<Customer>(command);
			customerSaved.commit();
			resolve(jwt);
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
