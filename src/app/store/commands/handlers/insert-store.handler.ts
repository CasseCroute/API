import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {InsertStoreCommand} from '../implementations/insert-store.command';
import {StoreRepository} from '../../repository/store.repository';
import {Store} from '@store';

@CommandHandler(InsertStoreCommand)
export class InsertStoreHandler implements ICommandHandler<InsertStoreCommand> {
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: InsertStoreCommand, resolve: (value?) => void) {
		const data = Store.register(command.name, command.email, command.phoneNumber, command.slug, command.imageUrl);

		const store = this.publisher.mergeObjectContext(
			await this.repository.save(data)
		);
		store.commit();
		resolve();
	}
}
