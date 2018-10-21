/* tslint:disable */
import {
	EntityRepository,
	Repository,
	Transaction,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Product} from '@letseat/domains/product/product.entity';

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

	public async findStoreProductByUuid(storeUuid: string, productUuid: string, selectId = false) {
		const storeProduct = await this.createQueryBuilder('product')
			.select(['product', 'ingredients'])
			.leftJoin('product.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.leftJoin('product.ingredients', 'ingredients')
			.where('product.uuid = :uuid', {uuid: productUuid})
			.getOne();
		return selectId ? storeProduct : omitDeep('id', storeProduct);
	}

	/**
	 * Same as findStoreProductByUuid except that this method doesn't return private properties
	 */
	public async findStoreProductByUuidPublic(storeUuid: string, productUuid: string, selectId = false) {
		const storeProduct = await this.createQueryBuilder('product')
			.select([
				'product.reference',
				'product.ean13',
				'product.price',
				'product.name',
				'product.description'
			])
			.leftJoin('product.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.where('product.uuid = :uuid', {uuid: productUuid})
			.getOne();
		return selectId ? storeProduct : omitDeep('id', storeProduct);
	}
}
