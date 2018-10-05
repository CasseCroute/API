import {
	Body, Controller, Get, HttpCode,
	NotFoundException, Param, Post, UnauthorizedException
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {Search} from '@letseat/application/queries/common/decorators/search.decorator';
import {Store} from '@letseat/domains/store/store.entity';
import {
	storeLoginValidatorOptions, storeRegisterValidatorOptions,
	StoreValidationPipe
} from '@letseat/domains/store/pipes';
import {JwtPayload, AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {
	GetStoreByEmailQuery, GetStoreByUuidQuery,
	GetStorePasswordQuery, GetStoresByQueryParamsQuery,
	GetStoresQuery
} from '@letseat/application/queries/store';
import {CreateStoreDto, LoginStoreDto} from '@letseat/domains/store/dtos';
import {CreateStoreCommand} from '@letseat/application/commands/store';

@Controller('stores')
export class StoreController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Get()
	public async get(@Search() queryParams): Promise<Store[] | Store> {
		return queryParams
			? this.commandBus.execute(new GetStoresByQueryParamsQuery(queryParams))
			: this.commandBus.execute(new GetStoresQuery());
	}

	@Get(':uuid')
	public async getOneByUuid(@Param('uuid') uuid: string) {
		return this.commandBus.execute(new GetStoreByUuidQuery(uuid));
	}

	@Post('/register')
	public async register(@Body(new StoreValidationPipe(storeRegisterValidatorOptions)) store: CreateStoreDto): Promise<JwtPayload> {
		return this.commandBus.execute(new CreateStoreCommand(store));
	}

	@Post('/login')
	@HttpCode(200)
	public async login(@Body(new StoreValidationPipe(storeLoginValidatorOptions)) store: LoginStoreDto): Promise<any> {
		return new Promise<any>(async (resolve: any, reject: any) => {
			return this.commandBus.execute(new GetStoreByEmailQuery(store.email))
				.then(async (storeFound: Store) => {
					const storeSelect = await this.commandBus.execute(new GetStorePasswordQuery(storeFound));
					await CryptographerService.comparePassword(store.password, storeSelect.password)
						? resolve(AuthService.createToken<Store>(storeFound))
						: reject(new UnauthorizedException('Invalid password'));
				})
				.catch(() => reject(new NotFoundException('Store doesn\'t exists')));
		});
	}
}
