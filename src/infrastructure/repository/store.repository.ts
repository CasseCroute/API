/* tslint:disable:no-unused */
import {EntityRepository, Repository, Transaction, TransactionManager} from 'typeorm';
import {Store} from '@letseat/domains/store/store.entity';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> implements ResourceRepository{
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

	public async findOneByUuid(storeUuid: string) {
		const store = await this.findOne({where: {uuid: storeUuid}});
		delete store!.id;
		return store;
	}

	public async getPassword(store: Store) {
		return this.findOne({select: ['password'], where: {id: store.id}});
	}

	@Transaction()
	public async findOneByPassword(store: Store, @TransactionManager() storeRepository: Repository<Store>) {
		return storeRepository.findOne(store);
	}
}
