import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {BadRequestException} from '@nestjs/common';
import {CreateOrderCommand} from '../create-order.command';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {defer} from 'rxjs';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {CartRepository} from '@letseat/infrastructure/repository/cart.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
	constructor(
		@InjectRepository(OrderRepository)
		private readonly orderRepository: OrderRepository,
		@InjectRepository(CustomerRepository)
		private readonly customerRepository: CustomerRepository,
		@InjectRepository(CartRepository)
		private readonly cartRepository: CartRepository) {
	}

	async execute(command: CreateOrderCommand, resolve: (value?) => void) {
		defer(async () => {
			return this.customerRepository.findOneByUuid(command.customerUuid);
		}).subscribe({
			next: async (customer: Customer) => {
				await this.orderRepository.createOrder(customer, command.order as any)
					.then(async () => {
						await this.cartRepository.destroyCart(customer.cart);
						resolve();
					})
					.catch(() => new BadRequestException('Cannot place an order'));
			},
			error: err => resolve(Promise.reject(new BadRequestException(err.message)))
		});
	}
}
