import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {CreateGuestOrderCommand} from '@letseat/application/commands/order';
import {defer} from 'rxjs';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';
import {BadRequestException} from '@nestjs/common';

@CommandHandler(CreateGuestOrderCommand)
export class CreateGuestOrderHandler implements ICommandHandler<CreateGuestOrderCommand> {
	constructor(
		@InjectRepository(OrderRepository)
		private readonly orderRepository: OrderRepository,
		@InjectRepository(StoreRepository)
		private readonly storeRepository: StoreRepository) {
	}

	async execute(command: CreateGuestOrderCommand, resolve: (value?) => void) {
		defer(async () => {
			return this.storeRepository.findOneByUuid(command.storeUuid);
		}).subscribe({
			next: async (store: Store | undefined) => {
				defer(async () => this.orderRepository.createGuestOrder(command.guestOrder, store as Store))
					.subscribe({
						next: () => resolve(),
						error: err => resolve(Promise.reject(new BadRequestException(err.message))),
					});
			},
			error: err => resolve(Promise.reject(new BadRequestException(err.message)))
		});
	}
}
