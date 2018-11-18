import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {UpdateSectionCommand} from '@letseat/application/commands/section';
import {SectionRepository} from '@letseat/infrastructure/repository/section.repository';

@CommandHandler(UpdateSectionCommand)
export class UpdateSectionHandler implements ICommandHandler<UpdateSectionCommand> {
	async execute(command: UpdateSectionCommand, resolve: (value?) => void) {
		const sectionRepository = getCustomRepository(SectionRepository);
		try {
			const section = sectionRepository.findStoreSectionByUuid(command.storeUuid, command.sectionUuid);
			if (!section) {
				return;
			}

			sectionRepository.updateProductSection(command.sectionUuid, command.section.name)
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
