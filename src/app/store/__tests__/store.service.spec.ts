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
			expect(await storeService.createOne(mocks.userCreateDto)).toBe(mocks.jwtPayload);
		});
	});
});
