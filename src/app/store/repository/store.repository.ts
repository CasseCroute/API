import {EntityRepository, Repository, Transaction, TransactionManager} from 'typeorm';
import {Store} from '@store';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
	@Transaction()
	public async saveStore(store: Store, @TransactionManager() storeRepository: Repository<Store>) {
		return storeRepository.save(store);
	}
}
