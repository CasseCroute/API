import {
	EntityRepository,
	Repository,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Section} from '@letseat/domains/section/section.entity';

@EntityRepository(Section)
export class SectionRepository extends Repository<Section> implements ResourceRepository {
	public async findOneByUuid(sectionUuid: string, selectId = false) {
		const section = await this.findOne({where: {uuid: sectionUuid}});
		return selectId ? section : omitDeep('id', section);
	}

	public async findStoreSections(storeUuid: string, selectId = false) {
		const storeSections = await this.createQueryBuilder('sections')
			.select()
			.leftJoin('sections.store', 'store')
			.leftJoinAndSelect('sections.products', 'products')
			.leftJoinAndSelect('sections.meals', 'meals')
			.leftJoinAndSelect('meals.product', 'mealProduct')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
		return selectId ? storeSections : omitDeep('id', storeSections);
	}

	public async findStoreSectionByUuid(storeUuid: string, sectionUuid: string, selectId = false) {
		const storeProduct = await this.createQueryBuilder('section')
			.select()
			.leftJoin('section.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.leftJoinAndSelect('section.meals', 'meals')
			.leftJoinAndSelect('section.products', 'products')
			.where('section.uuid = :uuid', {uuid: sectionUuid})
			.getOne();
		return selectId ? storeProduct : omitDeep('id', storeProduct);
	}

	public async deleteSectionByUuid(storeUuid: string, sectionUuid: string) {
		return this.createQueryBuilder('sections')
			.select()
			.leftJoinAndSelect('sections.store', 'store')
			.where('store.uuid = :storeUuid', {storeUuid})
			.delete()
			.where({uuid: sectionUuid})
			.execute();
	}
}
