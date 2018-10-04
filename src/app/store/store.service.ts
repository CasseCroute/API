import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {Store} from './store.entity';
import {CreateStoreCommand} from './commands/create-store.command';
import {JwtPayload} from '../auth/interfaces';
import {CreateStoreDto} from '@store';
import {GetStoreByEmailQuery} from './queries/get-store-by-email.query';
import {GetStorePasswordQuery} from './queries/get-store-password.query';
import {GetStoresQuery} from './queries/get-stores.query';
import {GetStoreByUuidQuery} from './queries/get-store-by-uuid.query';
import {GetStoresByQueryParamsQuery} from './queries/get-stores-by-query-params.query';

@Injectable()
export class StoreService {
	constructor(
		@InjectRepository(Store)
		private readonly storeRepository: Repository<Store>,
		private readonly commandBus: CommandBus,
	) {
	}

	public async createOne(store: CreateStoreDto): Promise<JwtPayload> {
		return this.commandBus.execute(new CreateStoreCommand(store));
	}

	public async findAll(): Promise<Store[]> {
		return this.commandBus.execute(new GetStoresQuery());
	}

	public async findOneByUuid(uuid: string): Promise<Store> {
		return this.commandBus.execute(new GetStoreByUuidQuery(uuid));
	}

	public async findByQueryParams(queryParams: object): Promise<Store | Store[]> {
		return this.commandBus.execute(new GetStoresByQueryParamsQuery(queryParams));
	}

	public async findOneByEmail(store: Store | any): Promise<Store> {
		return this.commandBus.execute(new GetStoreByEmailQuery(store.email));
	}

	public async getPassword(store: Store | any): Promise<Store> {
		return this.commandBus.execute(new GetStorePasswordQuery(store));
	}
}
