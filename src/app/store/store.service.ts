import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {Store} from './store.entity';
import {InsertStoreCommand} from './commands/insert-store.command';
import {JwtPayload} from '../auth/interfaces';
import {CreateStoreDto} from '@store';

@Injectable()
export class StoreService {
	constructor(
		@InjectRepository(Store)
		private readonly storeRepository: Repository<Store>,
		private readonly commandBus: CommandBus,
	) {
	}

	public async createOne(store: CreateStoreDto): Promise<JwtPayload> {
		return this.commandBus.execute(new InsertStoreCommand(store));
	}
}
