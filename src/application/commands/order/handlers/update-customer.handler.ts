/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {BadRequestException} from '@nestjs/common';
import {UpdateStatusOrderCommand} from '@letseat/application/commands/order/update-order-status.command';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {InjectRepository} from '@nestjs/typeorm';

@CommandHandler(UpdateStatusOrderCommand)
export class UpdateStatusOrderHandler implements ICommandHandler<UpdateStatusOrderCommand> {
	constructor(
		@InjectRepository(StoreRepository)
		private readonly storeRepository: StoreRepository) {
	}

	async execute(command: UpdateStatusOrderCommand, resolve: (value?) => void) {
		try {
			await this.storeRepository.updateOrderStatus(command.storeUuid, command.orderUuid, command.order.orderStatusUuid);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
