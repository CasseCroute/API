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
			.leftJoinAndSelect('stores.address', 'sections')
			.where('cuisine.slug = :cuisineSlug', {cuisineSlug})
			.getOne();
	}

}
