import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository, Repository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';
import {CreateKioskCommand} from '../create-kiosk.command';

/**
 * Handles a CreateKiosk command.
 */
@CommandHandler(CreateKioskCommand)
export class CreateKioskHandler implements ICommandHandler<CreateKioskCommand> {
	async execute(command: CreateKioskCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);
		try {
			await storeRepository.createKiosk(store, command, new Repository<Store>());
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
