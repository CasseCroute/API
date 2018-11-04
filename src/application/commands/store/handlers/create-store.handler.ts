import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CreateStoreCommand} from '../create-store.command';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import slugify from 'slugify';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {cryptoRandomString} from '@letseat/shared/utils';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(CreateStoreCommand)
export class CreateStoreHandler implements ICommandHandler<CreateStoreCommand> {
	async execute(command: CreateStoreCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		command.password = await CryptographerService.hashPassword(command.password);
		command.slug = `${slugify(command.name, {replacement: '-', lower: true})}-${cryptoRandomString(10)}`;

		try {
			const storeSaved = await storeRepository.saveStore(command as any);
			const jwt = AuthService.createToken<Store>(storeSaved);
			resolve(jwt);
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
