/* tslint:disable */
import {
	EntityRepository,
	getConnection,
	ObjectLiteral,
	getRepository,
	Repository,
	Transaction,
	TransactionManager, getManager
} from 'typeorm';
import {Store} from '@letseat/domains/store/store.entity';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {CreateKioskCommand} from '@letseat/application/commands/store/create-kiosk.command';
import {omitDeep} from '@letseat/shared/utils';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> implements ResourceRepository {
	@Transaction()
	public async saveStore(store: Store, @TransactionManager() storeRepository: Repository<Store>) {
		return storeRepository.save(store);
	}

	public async findOneByEmail(storeEmail: string) {
		return this.findOne({where: {email: storeEmail}});
	}

	public async findByQueryParams(queryParams: any) {
		const stores = await this.find({where: queryParams});
		return stores.map(({id, ...attrs}) => attrs);
	}

	public async findOneByUuid(storeUuid: string, selectId: boolean = false) {
		const store = await this.findOne({where: {uuid: storeUuid}});
		return selectId ? store : omitDeep('id', store);
	}

	public async getPassword(store: Store) {
		return this.findOne({select: ['password'], where: {id: store.id}});
	}

	public async getAddress(storeUuid: string) {
		return getManager()
			.createQueryBuilder(Store, 'store')
			.leftJoinAndSelect('store.address', 'address')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getOne();
	}

	public async getIngredient(storeUuid: string) {
		return getManager()
			.createQueryBuilder(Store, 'store')
			.leftJoinAndSelect('store.ingredient', 'ingredient')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getOne();
	}

	/**
	 * Adds a new Kiosk to a Store using SQL transaction
	 */
	@Transaction()
	public async createKiosk(
		store: Store,
		data: CreateKioskCommand | any,
		@TransactionManager() storeRepository: Repository<Store>): Promise<any> {
		const storeFound = await this.findOne({where: {uuid: store.uuid}, relations: ['kiosks']});
		storeFound!.kiosks.push(data.kiosk);
		return storeRepository.save(storeFound as Store);
	}

	@Transaction()
	public async findOneByPassword(store: Store): Promise<Store | undefined> {
		return this.findOne(store);
	}

	public async updateStore(uuid: string, values: ObjectLiteral) {
		return getRepository(Store).update({uuid}, {...values})
	}

	public static async deleteStoreByUuid(uuid: string) {
		return getConnection()
			.createQueryBuilder()
			.delete()
			.from(Store)
			.where('uuid = :uuid', {uuid})
			.execute();
	}

	@Transaction()
	public async saveIngredient(
		storeUuid: string,
		ingredient: Ingredient,
		@TransactionManager() storeRepository: Repository<Store>) {
		const store: Store = await this.findOneByUuid(storeUuid, true);
		store.ingredients = [ingredient];
		return storeRepository.save(store);
	}
}
