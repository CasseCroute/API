/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {BadRequestException} from '@nestjs/common';
import {UpdateOrderStatusCommand} from '@letseat/application/commands/order/update-order-status.command';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {InjectRepository} from '@nestjs/typeorm';

@CommandHandler(UpdateOrderStatusCommand)
export class UpdateStatusOrderHandler implements ICommandHandler<UpdateOrderStatusCommand> {
	constructor(
		@InjectRepository(StoreRepository)
		private readonly storeRepository: StoreRepository) {
	}

	async execute(command: UpdateOrderStatusCommand, resolve: (value?) => void) {
		try {
			const order = await this.storeRepository.updateOrderStatus(command.storeUuid, command.orderUuid, command.order.orderStatusUuid);
			console.log(order);
			if (order) {
				resolve(order);
			}
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
