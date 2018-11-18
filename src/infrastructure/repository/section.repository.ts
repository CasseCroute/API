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

	public async addSectionProduct(storeUuid: string, sectionUuid: string, section: AddSectionProductDto) {
		const mealsRepository = getCustomRepository(MealRepository);
		const productsRepository = getCustomRepository(ProductRepository);
		const {products, meals} = section;
		const storeSection = await this.findStoreSectionByUuid(storeUuid, sectionUuid) as Section;

		if (meals && meals.length > 0) {
			meals.forEach(async mealUuid => {
				const newMeal = await mealsRepository.findOneByUuid(mealUuid);

				if (newMeal === undefined) {
					return;
				}

				storeSection.meals.push(newMeal);
				return this.save(storeSection);

			});
		}

		if (!(products && products.length > 0)) {
			return;
		}

		products.forEach(async productUuid => {
			const newProduct = await productsRepository.findStoreProductByUuid(storeUuid, productUuid);

			if (newProduct === undefined) {
				return;
			}

			storeSection.products.push(newProduct);
			return this.save(storeSection);

		});

	}

	public async updateProductSection(sectionUuid: string, sectionName: string) {
		return this
			.createQueryBuilder()
			.update()
			.set({name: sectionName})
			.where({uuid: sectionUuid})
			.execute();
	}

	public async deleteSectionMealByUuid(sectionId: number, mealId: number) {
		return this
			.createQueryBuilder('sections')
			.delete()
			.from('sections_meals')
			.where('id_section = :idSection AND id_meal = :idMeal', {idSection: sectionId, idMeal: mealId})
			.execute();

	}

	public async deleteSectionProductByUuid(sectionId: number, productId: number) {
		return this
			.createQueryBuilder('sections')
			.delete()
			.from('sections_products')
			.where('id_section = :idSection AND id_product = :idProduct', {idSection: sectionId, idProduct: productId})
			.execute();

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
