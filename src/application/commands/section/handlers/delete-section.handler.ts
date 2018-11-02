import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {DeleteSectionCommand} from '@letseat/application/commands/section';
import {SectionRepository} from '@letseat/infrastructure/repository/section.repository';

@CommandHandler(DeleteSectionCommand)
export class DeleteSectionHandler implements ICommandHandler<DeleteSectionCommand> {
	async execute(command: DeleteSectionCommand, resolve: (value?) => void) {
		const sectionRepository = getCustomRepository(SectionRepository);
		try {
			sectionRepository.deleteSectionByUuid(command.storeUuid, command.sectionUuid)
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
