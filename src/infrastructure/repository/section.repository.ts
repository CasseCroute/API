import {
	EntityRepository,
	Repository,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {Section} from '@letseat/domains/section/section.entity';

@EntityRepository(Section)
export class SectionRepository extends Repository<Section> implements ResourceRepository {
	public async findOneByUuid(sectionUuid: string) {
		return this.findOne({where: {uuid: sectionUuid}});
	}

	public async findStoreSections(storeUuid: string) {
		return this.createQueryBuilder('sections')
			.select()
			.leftJoin('sections.store', 'store')
			.leftJoinAndSelect('sections.products', 'products')
			.leftJoinAndSelect('sections.meals', 'meals')
			.leftJoinAndSelect('meals.product', 'mealProduct')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
	}

	public async findStoreSectionByUuid(storeUuid: string, sectionUuid: string) {
		return this.createQueryBuilder('section')
			.select()
			.leftJoin('section.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.leftJoinAndSelect('section.meals', 'meals')
			.leftJoinAndSelect('section.products', 'products')
			.where('section.uuid = :uuid', {uuid: sectionUuid})
			.getOne();
	}
}
