import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {Store} from './store.entity';
import {InsertStoreCommand} from './commands/implementations/insert-store.command';

@Injectable()
export class StoreService {
	constructor(
		@InjectRepository(Store)
		private readonly storeRepository: Repository<Store>,
		private readonly commandBus: CommandBus
	) {
	}

	public async createOne(): Promise<Store> {
		return this.commandBus.execute(
			new InsertStoreCommand('Burger King', 'hello@burgerking.com', '010101010', 'burgerking-aA22')
		);
	}
}
