import {
	EntityRepository, getCustomRepository,
	Repository,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {Section} from '@letseat/domains/section/section.entity';
import {AddSectionProductDto} from '@letseat/domains/section/dtos/add-section-product.dto';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';

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

	public async addSectionProduct(storeUuid: string, section: AddSectionProductDto) {
		const mealsRepository = getCustomRepository(MealRepository);
		const productsRepository = getCustomRepository(ProductRepository);
		const {sectionUuid, products, meals} = section;

		console.log(sectionUuid + products + meals);
		const storeSection = await this.findStoreSectionByUuid(storeUuid, sectionUuid) as Section;

		if (!(meals && meals.length > 0)) {
			return;
		}

		meals.forEach(mealUuid => {
			const newMeal = mealsRepository.findOneByUuid(mealUuid);

			if (newMeal) {
				return;
			}

			storeSection.meals.push(newMeal);
			this.save(storeSection);

		});

		products.forEach(productUuid => {
			const newProduct = productsRepository.findStoreProductByUuid(storeUuid, productUuid);
			if (newProduct) {
				return;
			}

			storeSection.products.push(newProduct);
			this.save(newProduct);
		});
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
