import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {BadRequestException} from '@nestjs/common';
import {CreateOrderCommand} from '../create-order.command';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {defer} from 'rxjs';
import {Customer} from '@letseat/domains/customer/customer.entity';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
	constructor(
		@InjectRepository(OrderRepository)
		private readonly orderRepository: OrderRepository,
		@InjectRepository(CustomerRepository)
		private readonly customerRepository: CustomerRepository) {
	}

	async execute(command: CreateOrderCommand, resolve: (value?) => void) {
		defer(async () => {
			return this.customerRepository.findOneByUuid(command.customerUuid);
		}).subscribe({
			next: async (customer: Customer) => {
				await this.orderRepository.createOrder(customer, command.order as any);
				resolve();
			},
			error: err => resolve(Promise.reject(new BadRequestException(err.message)))
		});
	}
}
