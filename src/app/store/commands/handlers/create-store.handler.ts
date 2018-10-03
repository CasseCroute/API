import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CreateStoreCommand} from '../create-store.command';
import {StoreRepository} from '../../repository/store.repository';
import {Store} from '@store';
import {getCustomRepository, Repository} from 'typeorm';
import {AuthStoreService, CryptographerService} from '@auth';
import {BadRequestException} from '@nestjs/common';
import slugify from 'slugify';
import {cryptoRandomString} from '@shared';

@CommandHandler(CreateStoreCommand)
export class CreateStoreHandler implements ICommandHandler<CreateStoreCommand> {
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: CreateStoreCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		command.password = await CryptographerService.hashPassword(command.password);
		command.slug = `${slugify(command.name, {replacement: '-', lower: true})}-${cryptoRandomString(10)}`;
		const store = Store.register(command);

		try {
			const storeSaved = this.publisher.mergeObjectContext(
				await storeRepository.saveStore(store, new Repository<Store>())
			);
			delete storeSaved.password;
			const jwt = AuthStoreService.createToken<Store>(command);
			storeSaved.commit();
			resolve(jwt);
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
