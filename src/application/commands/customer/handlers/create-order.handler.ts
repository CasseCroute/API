import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {BadRequestException} from '@nestjs/common';
import {CreateOrderCommand} from '../create-order.command';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
	constructor(
		@InjectRepository(OrderRepository)
		private readonly orderRepository: OrderRepository,
		@InjectRepository(CustomerRepository)
		private readonly customerRepository: CustomerRepository) {
	}

	async execute(command: CreateOrderCommand, resolve: (value?) => void) {
		try {
			const customer = await this.customerRepository.findOneByUuid(command.customerUuid);
			await this.orderRepository.createOrder(customer, command.order as any);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
