/*tslint:disable*/
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {NotFoundException} from '@nestjs/common';
import {SectionRepository} from '@letseat/infrastructure/repository/section.repository';
import {GetStoreSectionByUuidQuery} from '@letseat/application/queries/store/get-store-section-by-uuid.query';

@CommandHandler(GetStoreSectionByUuidQuery)
export class GetStoreSectionByUuidHandler implements ICommandHandler<GetStoreSectionByUuidQuery> {
	async execute(command: GetStoreSectionByUuidQuery, resolve: (value?) => void) {
		const sectionRepository = getCustomRepository(SectionRepository);
		try {
			const section = await sectionRepository.findStoreSectionByUuid(command.storeUuid, command.sectionUuid);
			typeof section === undefined
				? resolve(Promise.reject(new NotFoundException('Section not found')))
				: resolve(section);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
