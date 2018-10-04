import {EntityRepository, Repository, Transaction, TransactionManager} from 'typeorm';
import {Store} from '@store';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
	@Transaction()
	public async saveStore(store: Store, @TransactionManager() storeRepository: Repository<Store>) {
		return storeRepository.save(store);
	}

	public async findOneByEmail(storeEmail: string) {
		return this.findOne({where: {email: storeEmail}});
	}

	public async findOneByUuid(storeUuid: string) {
		return this.findOne({where: {uuid: storeUuid}});
	}

	public async getPassword(store: Store) {
		return this.findOne({select: ['password'], where: {id: store.id}});
	}

	@Transaction()
	public async findOneByPassword(store: Store, @TransactionManager() storeRepository: Repository<Store>) {
		return storeRepository.findOne(store);
	}
}
