import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CreateCustomerCommand} from '../create-customer.command';
import {CustomerRepository} from '../../repository/customer.repository';
import {Customer} from '@customer';
import {getCustomRepository, Repository} from 'typeorm';
import {AuthService, CryptographerService} from '@auth';
import {BadRequestException} from '@nestjs/common';
import slugify from 'slugify';
import {cryptoRandomString} from '@shared';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
	constructor(private readonly repository: CustomerRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: CreateCustomerCommand, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		command.password = await CryptographerService.hashPassword(command.password);
		command.slug = `${slugify(command.name, {replacement: '-', lower: true})}-${cryptoRandomString(10)}`;
		const customer = Customer.register(command);

		try {
			const customerSaved = this.publisher.mergeObjectContext(
				await customerRepository.saveCustomer(customer, new Repository<Customer>())
			);
			delete customerSaved.password;
			const jwt = AuthService.createToken<Customer>(command);
			customerSaved.commit();
			resolve(jwt);
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
