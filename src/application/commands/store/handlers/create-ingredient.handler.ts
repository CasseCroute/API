import {EventPublisher, ICommandHandler, CommandHandler, AggregateRoot} from '@nestjs/cqrs';
import {getCustomRepository, Repository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';
import {CreateIngredientCommand} from '../create-ingredient.command';

/**
 * Handles a CreateIngredient command.
 */
@CommandHandler(CreateIngredientCommand)
export class CreateIngredientHandler implements ICommandHandler<CreateIngredientCommand> {
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: CreateIngredientCommand, resolve: (value?) => void) {
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
