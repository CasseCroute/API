import {Connection, EntityRepository, Repository} from 'typeorm';
import {Store} from '@store';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
}

