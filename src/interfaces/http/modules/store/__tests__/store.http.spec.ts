import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {StoreController} from '../store.controller';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {CommandBus, EventPublisher, EventBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';

describe('Store HTTP Requests', () => {
	let app: INestApplication;
	let commandBus: CommandBus;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StoreController],
			providers: [
				CQRSModule,
				AuthService,
				CommandBus,
				EventPublisher,
				EventBus,
				{
					provide: getRepositoryToken(Store),
					useValue: mocks.storeRepository,
				},
			]
		})
			.overrideProvider(AuthService).useValue(mocks.authService)
			.overrideProvider(EventBus).useValue({
				setModuleRef: jest.fn(),
				publish: jest.fn()
			})
			.overrideProvider(CommandBus).useValue({
				register: jest.fn(),
				execute: jest.fn()
			})
			.compile();

		app = module.createNestApplication();
		commandBus = module.get<CommandBus>(CommandBus);
		await app.init();
	});

	describe('GET /', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores')
				.expect(200);
		});
	});

	describe('GET /?term=search', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores?name=BurgerKing')
				.expect(200);
		});
		it('should return a HTTP 422 status code when incorrect', () => {
			return request(app.getHttpServer())
				.get('/stores?incorrect=BurgerKing')
				.expect(422);
		});
	});

	describe('POST /register', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/register')
				.send(mocks.storeCreateDto)
				.expect(201);
		});

		it('should return a HTTP 500 status code when failed', () => {
			return request(app.getHttpServer())
				.post('/stores/register')
				.send({})
				.expect(500);
		});
	});

	describe('POST /login', () => {
		it('should return a HTTP 200 status code when successful', () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.commandBus.findOneByEmail(mocks.storeRepository.data[0]));
			jest.spyOn(CryptographerService, 'comparePassword')
				.mockImplementation(mocks.cryptographerService.comparePassword);
			return request(app.getHttpServer())
				.post('/stores/login')
				.send(mocks.storeLoginDto)
				.expect(200);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
