import {Controller, Post} from '@nestjs/common';
import {Store} from './store.entity';
import {StoreService} from './store.service';

@Controller('stores')
export class StoreController {
	constructor(private readonly storeService: StoreService) {
	}

	@Post('/register')
	public async register(): Promise<Store> {
		return this.storeService.createOne();
	}
}
