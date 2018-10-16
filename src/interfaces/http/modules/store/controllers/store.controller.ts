import {
	Body, Controller, Delete, Get, HttpCode,
	NotFoundException, Param, Patch, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {Search} from '@letseat/application/queries/common/decorators/search.decorator';
import {Store} from '@letseat/domains/store/store.entity';
import {
	storeLoginValidatorOptions, storeRegisterValidatorOptions, storeUpdateValidatorOptions,
} from '@letseat/domains/store/pipes';
import {JwtPayload, AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {
	GetStoreByEmailQuery, GetStoreByUuidQuery,
	GetStorePasswordQuery, GetStoresByQueryParamsQuery,
	GetStoresQuery
} from '@letseat/application/queries/store';
import {CreateStoreDto, LoginStoreDto} from '@letseat/domains/store/dtos';
import {CreateStoreCommand, UpdateStoreByUuidCommand} from '@letseat/application/commands/store';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {DeleteStoreByUuidCommand} from '@letseat/application/commands/store/delete-store-by-uuid.command';
import {UpdateStoreDto} from '@letseat/domains/store/dtos/update-store.dto';

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

	@Get('/me')
	@UseGuards(AuthGuard('jwt'))
	public async currentUser(@Req() request: any) {
		return this.commandBus.execute(new GetStoreByUuidQuery(request.user.uuid));
	}

	@Get(':uuid')
	public async getOneByUuid(@Param('uuid') uuid: string) {
		return this.commandBus.execute(new GetStoreByUuidQuery(uuid));
	}

	@Post('/register')
	public async register(@Body(new ValidationPipe<Store>(storeRegisterValidatorOptions)) store: CreateStoreDto): Promise<JwtPayload> {
		return this.commandBus.execute(new CreateStoreCommand(store));
	}

	@Patch('/me')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async updateCurrentStore(
		@Req() request: any,
		@Body(new ValidationPipe<Store>(storeUpdateValidatorOptions)) valuesToUpdate: UpdateStoreDto) {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new UpdateStoreByUuidCommand(request.user.uuid, valuesToUpdate))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Post('/login')
	@HttpCode(200)
	public async login(@Body(new ValidationPipe<Store>(storeLoginValidatorOptions)) store: LoginStoreDto): Promise<any> {
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

	@Delete('/me')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async deleteCurrentUser(@Req() request: any) {
		return this.commandBus.execute(new DeleteStoreByUuidCommand(request.user.uuid));
	}
}
