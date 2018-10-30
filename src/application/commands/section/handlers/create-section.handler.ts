import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {CreateSectionCommand} from '@letseat/application/commands/section';

@CommandHandler(CreateSectionCommand)
export class CreateSectionHandler implements ICommandHandler<CreateSectionCommand> {
	async execute(command: CreateSectionCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		try {
			storeRepository.saveStoreSection(command.storeUuid, command.section as any)
				.then(() => {
					resolve();
				})
				.catch(err => {
					resolve(Promise.reject(new BadRequestException(err)));
				});
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
