import {Body, Controller, Get, HttpCode, NotFoundException, Post, UnauthorizedException} from '@nestjs/common';
import {StoreService} from './store.service';
import {AuthService, CryptographerService, JwtPayload} from '@auth';
import {
	storeLoginValidatorOptions, storeRegisterValidatorOptions,
	StoreValidationPipe
} from './pipes/store.validation.pipe';
import {CreateStoreDto, LoginStoreDto} from './dtos';
import {Store} from './store.entity';

@Controller('stores')
export class StoreController {
	constructor(private readonly storeService: StoreService) {
	}

	@Get()
	public async get(): Promise<Store[]> {
		return this.storeService.findAll();
	}

	@Post('/register')
	public async register(@Body(new StoreValidationPipe(storeRegisterValidatorOptions)) store: CreateStoreDto): Promise<JwtPayload> {
		return this.storeService.createOne(store);
	}

	@Post('/login')
	@HttpCode(200)
	public async login(@Body(new StoreValidationPipe(storeLoginValidatorOptions)) store: LoginStoreDto): Promise<any> {
		return new Promise<any>(async (resolve: any, reject: any) => {
			return this.storeService.findOneByEmail(store)
				.then(async (storeFound: Store) => {
					const storeSelect = await this.storeService.getPassword(storeFound);
					await CryptographerService.comparePassword(store.password, storeSelect.password)
						? resolve(AuthService.createToken<Store>(storeFound))
						: reject(new UnauthorizedException('Invalid password'));
				})
				.catch(() => reject(new NotFoundException('Store doesn\'t exists')));
		});
	}
}
