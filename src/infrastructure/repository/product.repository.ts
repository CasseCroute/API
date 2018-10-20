/* tslint:disable */
import {
	EntityRepository,
	Repository,
	Transaction,
	TransactionManager, getManager, createQueryBuilder,
} from 'typeorm';
import {Store} from '@letseat/domains/store/store.entity';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {ProductIngredient} from '@letseat/domains/product-ingredient/product-ingredient.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> implements ResourceRepository {
	@Transaction()

	public async findOneByUuid(productUuid: string, selectId: boolean = false) {
		const product = await this.findOne({where: {uuid: productUuid}});
		return selectId ? product : omitDeep('id', product);
	}

	public async findStoreProducts(storeUuid: string, selectId = false) {
		const storeProducts = await this.createQueryBuilder('product')
			.select()
			.leftJoin('product.store', 'store')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
		return selectId ? storeProducts : omitDeep('id', storeProducts);
	}

	public async findStoreProductsPublic(storeUuid: string, selectId = false) {
		const storeProducts = await this.createQueryBuilder('product')
			.select([
				'product.reference',
				'product.ean13',
				'product.price',
				'product.name',
				'product.description'
			])
			.leftJoin('product.store', 'store')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
		return selectId ? storeProducts : omitDeep('id', storeProducts);
	}
}
