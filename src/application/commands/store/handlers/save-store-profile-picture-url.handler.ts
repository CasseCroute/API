import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {SaveStoreProfilePictureUrlCommand} from '@letseat/application/commands/store';
import {defer} from 'rxjs';

/**
 * Handles a SaveStoreProfilePictureUrl command.
 */
@CommandHandler(SaveStoreProfilePictureUrlCommand)
export class SaveStoreProfilePictureUrlHandler implements ICommandHandler<SaveStoreProfilePictureUrlCommand> {
	constructor(
		@InjectRepository(StoreRepository)
		private readonly storeRepository: StoreRepository) {
	}

	async execute(command: SaveStoreProfilePictureUrlCommand, resolve: (value?) => void) {
		defer(async () => {
			return this.storeRepository.saveStoreProfilePictureUrl(command.storeUuid, command.imageUrl);
		}).subscribe({
			next: () => resolve(),
			error: err => resolve(Promise.reject(new BadRequestException(err.message))),
		});
	}
}
