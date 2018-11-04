import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CreateStoreCommand} from '../create-store.command';
import {InjectRepository} from '@nestjs/typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {slugify} from '@letseat/shared/utils';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(CreateStoreCommand)
export class CreateStoreHandler implements ICommandHandler<CreateStoreCommand> {
	constructor(@InjectRepository(StoreRepository) private readonly storeRepository: StoreRepository) {
	}

	async execute(command: CreateStoreCommand, resolve: (value?) => void) {
		command.password = await CryptographerService.hashPassword(command.password);
		command.slug = slugify(command.name);

		try {
			const storeSaved = await this.storeRepository.saveStore(command as any);
			const jwt = AuthService.createToken<Store>(storeSaved);
			resolve(jwt);
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
