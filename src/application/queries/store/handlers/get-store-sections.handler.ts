import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreSectionsQuery} from '@letseat/application/queries/store/get-store-sections.query';
import {SectionRepository} from '@letseat/infrastructure/repository/section.repository';

@CommandHandler(GetStoreSectionsQuery)
export class GetStoreSectionsHandler implements ICommandHandler<GetStoreSectionsQuery> {
	async execute(command: GetStoreSectionsQuery, resolve: (value?) => void) {
		const sectionRepository = getCustomRepository(SectionRepository);
		try {
			const sections = await sectionRepository.findStoreSections(command.storeUuid);
			resolve(sections);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
