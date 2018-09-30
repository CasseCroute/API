import {Body, Controller, Post} from '@nestjs/common';
import {StoreService} from './store.service';
import {JwtPayload} from '../auth/interfaces';
import {storeRegisterValidatorOptions, StoreValidationPipe} from './pipes/store.validation.pipe';
import {CreateStoreDto} from './dtos';
import {AuthService} from '@auth';

@Controller('stores')
export class StoreController {
	constructor(private readonly storeService: StoreService, private readonly authService: AuthService) {
	}

	@Post('/register')
	public async register(@Body(new StoreValidationPipe(storeRegisterValidatorOptions)) store: CreateStoreDto): Promise<JwtPayload> {
		return this.storeService.createOne(store);
	}
}
