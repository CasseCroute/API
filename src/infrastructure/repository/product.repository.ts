/* tslint:disable */
import {
	EntityRepository, ObjectLiteral,
	Repository,
	Transaction,
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {Product} from '@letseat/domains/product/product.entity';
import {LoggerService} from '@letseat/infrastructure/services';
import {NotFoundException} from '@nestjs/common';
import {Store} from '@letseat/domains/store/store.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> implements ResourceRepository {
	public async findOneByUuid(productUuid: string, relations?: string[]) {
		return this.findOne({where: {uuid: productUuid}, relations});
	}

	public async findOneByUuidAndStore(productUuid: string, storeUuid: string) {
		return this.createQueryBuilder('product')
			.leftJoin('product.store', 'store')
			.where('product.uuid = :productUuid', {productUuid})
			.andWhere('store.uuid = :storeUuid', {storeUuid})
			.getOne();
	}

	public async updateProduct(storeId: number, productUuid: string, values: ObjectLiteral) {
		return this.createQueryBuilder('product')
			.update()
			.set(values)
			.where('id_store = :id and uuid = :uuid', {id: storeId, uuid: productUuid})
			.execute();
	}

	public async findStoreProducts(storeUuid: string) {
		return this.createQueryBuilder('product')
			.leftJoin('product.store', 'store')
			.leftJoinAndSelect('product.ingredients', 'ingredients')
			.leftJoinAndSelect('product.cuisine', 'cuisine')
			.leftJoinAndSelect('ingredients.ingredient', 'ingredient')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getMany();
	}

	public async findProductWithIngredients(productUuid: string) {
		return this.createQueryBuilder('product')
			.leftJoin('product.store', 'store')
			.leftJoinAndSelect('product.ingredients', 'ingredients')
			.leftJoinAndSelect('product.cuisine', 'cuisine')
			.leftJoinAndSelect('ingredients.ingredient', 'ingredient')
			.where('product.uuid = :uuid', {uuid: productUuid})
			.getOne();
	}

	public async findStoreProductsPublic(storeUuid: string) {
		return this.createQueryBuilder('product')
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
	}

	public async findStoreProductByUuid(storeUuid: string, productUuid: string) {
		try {
			return this.createQueryBuilder('product')
				.select(['product', 'ingredients'])
				.leftJoin('product.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
				.leftJoin('product.ingredients', 'ingredients')
				.where('product.uuid = :uuid', {uuid: productUuid})
				.getOne();
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
			throw new NotFoundException();
		}
	}

	/**
	 * Same as findStoreProductByUuid except that this method doesn't return private properties
	 */
	public async findStoreProductByUuidPublic(storeUuid: string, productUuid: string) {
		return this.createQueryBuilder('product')
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
	}

	public async deleteProductByUuid(storeUuid: string, productUuid: string){
		return this.createQueryBuilder('product')
			.leftJoin('product.store', 'store', 'store.uuid = :uuid', {uuid: storeUuid})
			.where('product.uuid = :uuid', {uuid: productUuid})
			.delete()
			.execute()
	}

	public async saveProductPictureUrl(storeUuid: string, mealUuid: string, imageUrl: string) {
		const product = await this.findOneByUuidAndStore(mealUuid, storeUuid);
		if (product) {
			product.imageUrl = imageUrl;
			await this.save(product);
		}
	}
}
