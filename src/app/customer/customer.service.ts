import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {Customer} from './customer.entity';
import {CreateCustomerCommand} from './commands/create-customer.command';
import {JwtPayload} from '../auth/interfaces';
import {CreateCustomerDto} from './dtos/create-customer.dto';
import {GetCustomerByEmailQuery} from './queries/get-customer-by-email.query';
import {GetCustomerPasswordQuery} from './queries/get-customer-password.query';

@Injectable()
export class CustomerService {
	constructor(
		@InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
		private readonly commandBus: CommandBus,
	) {
	}

	public async createOne(customer: CreateCustomerDto): Promise<JwtPayload> {
		return this.commandBus.execute(new CreateCustomerCommand(customer));
	}

	public async findOneByEmail(customer: Customer | any): Promise<Customer> {
		return this.commandBus.execute(new GetCustomerByEmailQuery(customer.email));
	}

	public async getPassword(customer: Customer | any): Promise<Customer> {
		return this.commandBus.execute(new GetCustomerPasswordQuery(customer));
	}
}
