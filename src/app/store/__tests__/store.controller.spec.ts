import {Test} from '@nestjs/testing';
import {StoreController, StoreService, Store} from '@store';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {AuthService} from '@auth';

describe('StoreController', () => {
	let storeController: StoreController;
	let storeService: StoreService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [StoreController],
			providers: [StoreService, CommandBus, AuthService,
				{
					provide: getRepositoryToken(Store),
					useValue: mocks.storeRepository
				},
			]
		})
			.overrideProvider(AuthService).useValue(mocks.authService)
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

	describe('get()', () => {
		it('should return an array of Store', async () => {
			jest.spyOn(storeService, 'findAll').mockImplementation(() => mocks.storeRepository.data);
			expect(await storeController.get(null)).toBe(mocks.storeRepository.data);
		});
	});

	describe('getOneByUuid()', () => {
		it('should return an array of Store', async () => {
			jest.spyOn(storeService, 'findOneByUuid').mockImplementation(() => mocks.storeRepository.data[0].uuid);
			expect(await storeController.getOneByUuid('9c1e887c-4a77-47ca-a572-c9286d6b7cea')).toBe(mocks.storeRepository.data[0].uuid);
		});
	});

	describe('get(queryParams)', () => {
		it('should return an array of Store', async () => {
			jest.spyOn(storeService, 'findByQueryParams').mockImplementation(() => mocks.storeRepository.data);
			expect(await storeController.get({name: 'Burger King'})).toBe(mocks.storeRepository.data);
		});
	});
});
