import {Test} from '@nestjs/testing';
import {StoreService, Store} from '@store';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';

describe('StoreController', () => {
	let storeService: StoreService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [StoreService, CommandBus,
				{
					provide: getRepositoryToken(Store),
					useValue: mocks.storeRepository
				},
			]
		}).compile();

		storeService = module.get<StoreService>(StoreService);
	});

	describe('createOne()', () => {
		it('should return a JWT', async () => {
			jest.spyOn(storeService, 'createOne').mockImplementation(() => mocks.jwtPayload);
			expect(await storeService.createOne(mocks.storeCreateDto)).toBe(mocks.jwtPayload);
		});
	});

	describe('findOneByEmail()', () => {
		it('should return a store', async () => {
			jest.spyOn(storeService, 'findOneByEmail').mockImplementation(() => mocks.storeRepository.data[0]);
			expect(await storeService.findOneByEmail(mocks.storeLoginDto)).toBe(mocks.storeRepository.data[0]);
		});
	});

	describe('getPassword()', () => {
		it('should return a password', async () => {
			jest.spyOn(storeService, 'getPassword').mockImplementation(() => mocks.storeRepository.data[0].password);
			expect(await storeService.getPassword(mocks.storeLoginDto)).toBe(mocks.storeRepository.data[0].password);
		});
	});
});
