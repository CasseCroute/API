import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {StoreController} from '../controllers';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {LoggerService} from '@letseat/infrastructure/services';
import {AWSService} from '../../../../../infrastructure/services/aws.service';

describe('Store HTTP Requests', () => {
	let app: INestApplication;
	let commandBus: CommandBus;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
				StoreController
			],
			providers: [
				CQRSModule,
				AuthService,
				CommandBus,
				AWSService,
				{
					provide: getRepositoryToken(Store),
					useValue: mocks.storeRepository,
				},
			]
		})
			.overrideProvider(AuthService).useValue(mocks.authService)
			.overrideProvider(CommandBus).useValue({
				register: jest.fn(),
				execute: jest.fn()
			})
			.overrideProvider(JwtStrategy).useClass(mocks.JwtStrategyMock)
			.compile();

		app = module.createNestApplication();
		app.useGlobalFilters(new CustomExceptionFilter());
		const logger = new LoggerService('Server');
		app.useLogger(logger);
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

	describe('GET /:uuid', () => {
		it('should return a HTTP 200 status code when successful', () => {
			jest.spyOn(commandBus, 'execute')
				.mockImplementation(() => mocks.commandBus.findOneByUuid(mocks.storeRepository.data[0].uuid));
			return request(app.getHttpServer())
				.get(`/stores/${mocks.storeRepository.data[0].uuid}`)
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

	describe('GET /me', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores/me')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.get('/stores/me')
				.expect(401);
		});
	});

	describe('POST /register', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/register')
				.send(mocks.storeCreateDto)
				.expect(201);
		});

		it('should return a HTTP 400 status code when failed', () => {
			return request(app.getHttpServer())
				.post('/stores/register')
				.send({})
				.expect(400);
		});
	});

	describe('POST /login', () => {
		it('should return a HTTP 200 status code when successful', () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.commandBus.findOneByEmail(mocks.storeRepository.data[0]));
			jest.spyOn(CryptographerService, 'comparePassword')
				.mockImplementation(mocks.cryptographerService.comparePassword);
			return request(app.getHttpServer())
				.post('/stores/login')
				.send(mocks.storeLoginDto as Store)
				.expect(200);
		});
	});

	describe('DELETE /me', () => {
		it('should return a HTTP 204 status code when successful', () => {
			return request(app.getHttpServer())
				.delete('/stores/me')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(204);
		});

		it('should return an HTTP 401 status code when no JWT is provided', () => {
			return request(app.getHttpServer())
				.delete('/stores/me')
				.expect(401);
		});

		it('should return an empty body when succesful', () => {
			return request(app.getHttpServer())
				.delete('/stores/me')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect((res: any) => {
					res.body = '';
				});
		});
	});

	describe('PATCH /me', () => {
		it('should return a HTTP 204 status code when successful', () => {
			return request(app.getHttpServer())
				.patch('/stores/me')
				.send({email: 'hello@burgerking.com'})
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(204);
		});

		it('should return an HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.patch('/stores/me')
				.send({fake: 'hello@burgerking.com'})
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(400);
		});

		it('should return an HTTP 401 status code when no JWT is provided', () => {
			return request(app.getHttpServer())
				.patch('/stores/me')
				.expect(401);
		});

		it('should return an empty body when succesful', () => {
			return request(app.getHttpServer())
				.patch('/stores/me')
				.send({email: 'hello@mail.com'})
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect((res: any) => {
					res.body = '';
				});
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
