import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {AddSectionProductCommand} from '@letseat/application/commands/section';
import {SectionRepository} from '@letseat/infrastructure/repository/section.repository';

@CommandHandler(AddSectionProductCommand)
export class AddSectionProductHandler implements ICommandHandler<AddSectionProductCommand> {
	async execute(command: AddSectionProductCommand, resolve: (value?) => void) {
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
