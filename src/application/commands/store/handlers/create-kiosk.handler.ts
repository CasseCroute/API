import {EventPublisher, ICommandHandler, CommandHandler, AggregateRoot} from '@nestjs/cqrs';
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
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: CreateKioskCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const store = Store.register(command);
		try {
			const storeKioskCreated = this.publisher.mergeObjectContext(
				await storeRepository.createKiosk(store, command, new Repository<Store>()) as AggregateRoot
			);
			storeKioskCreated.commit();
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
