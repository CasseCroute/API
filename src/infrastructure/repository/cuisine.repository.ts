import {EntityRepository, Repository} from 'typeorm';
import {Cuisine} from '@letseat/domains/cuisine/cuisine.entity';

@EntityRepository(Cuisine)
export class CuisineRepository extends Repository<Cuisine> {
	public async findOneByUuid(uuid: string) {
		return this.findOne({where: {uuid}});
	}

	public async findCuisineStoresByCuisineSlug(cuisineSlug: string) {
		return this.createQueryBuilder('cuisine')
			.leftJoinAndSelect('cuisine.stores', 'stores')
			.leftJoinAndSelect('stores.sections', 'sections')
			.leftJoinAndSelect('sections.meals', 'meals')
			.leftJoinAndSelect('meals.product', 'product')
			.leftJoinAndSelect('meals.subsections', 'subsections')
			.leftJoinAndSelect('subsections.options', 'options')
			.leftJoinAndSelect('sections.products', 'products')
			.where('cuisine.slug = :cuisineSlug', {cuisineSlug})
			.getMany();
	}

}
