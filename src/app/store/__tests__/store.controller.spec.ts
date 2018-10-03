import {Test} from '@nestjs/testing';
import {StoreController, StoreService, Store} from '@store';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {AuthStoreService} from '@auth';

describe('StoreController', () => {
	let storeController: StoreController;
	let storeService: StoreService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [StoreController],
			providers: [StoreService, CommandBus, AuthStoreService,
				{
					provide: getRepositoryToken(Store),
					useValue: mocks.storeRepository
				},
			]
		})
			.overrideProvider(AuthStoreService).useValue(mocks.authService)
			.compile();

		storeController = module.get<StoreController>(StoreController);
		storeService = module.get<StoreService>(StoreService);
	});

	describe('register()', () => {
		it('should return a JWT', async () => {
			jest.spyOn(storeService, 'createOne').mockImplementation(() => mocks.jwtPayload);
			expect(await storeController.register(mocks.storeCreateDto)).toBe(mocks.jwtPayload);
		});
	});
});
