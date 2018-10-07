import {Test} from '@nestjs/testing';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {StoreController} from '@letseat/interfaces/http/modules/store/store.controller';
import {AuthService} from '@letseat/infrastructure/authorization';
import {Store} from '@letseat/domains/store/store.entity';
import {StoreKiosksController} from '../store.controller';

describe('StoreController', () => {
	let storeController: StoreController;
	let commandBus: CommandBus;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [StoreController],
			providers: [CommandBus, AuthService,
				{
					provide: getRepositoryToken(Store),
					useValue: mocks.storeRepository
				},
			]
		})
			.overrideProvider(AuthService).useValue(mocks.authService)
			.compile();

		storeController = module.get<StoreController>(StoreController);
		commandBus = module.get<CommandBus>(CommandBus);
	});

	describe('register()', () => {
		it('should return a JWT', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.jwtPayload);
			expect(await storeController.register(mocks.storeCreateDto)).toBe(mocks.jwtPayload);
		});
	});

	describe('get()', () => {
		it('should return an array of Store', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.storeRepository.data);
			expect(await storeController.get(null)).toBe(mocks.storeRepository.data);
		});
	});

	describe('currentUser()', () => {
		it('should return a Store when successful', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.storeRepository.data[0]);
			expect(await storeController.currentUser({user: mocks.storeRepository.data[0]})).toBe(mocks.storeRepository.data[0]);
		});
	});

	describe('getOneByUuid()', () => {
		it('should return an array of Store', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.storeRepository.data[0].uuid);
			expect(await storeController.getOneByUuid('9c1e887c-4a77-47ca-a572-c9286d6b7cea')).toBe(mocks.storeRepository.data[0].uuid);
		});
	});

	describe('get(queryParams)', () => {
		it('should return an array of Store', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.storeRepository.data);
			expect(await storeController.get({name: 'Burger King'})).toBe(mocks.storeRepository.data);
		});
	});
});
