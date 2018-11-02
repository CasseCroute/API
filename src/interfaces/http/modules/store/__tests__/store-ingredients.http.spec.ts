import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {CurrentStoreIngredientsController, StoreIngredientsController} from '../controllers';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService} from '@letseat/infrastructure/authorization';
import {CommandBus, EventPublisher, EventBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {LoggerService} from '../../../../../infrastructure/services';

describe('Store Ingredients HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
				CurrentStoreIngredientsController,
				StoreIngredientsController
			],
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
				{
					provide: getRepositoryToken(Ingredient),
					useValue: mocks.ingredientRepository,
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
			.overrideProvider(JwtStrategy).useClass(mocks.JwtStrategyMock)
			.compile();

		app = module.createNestApplication();
		app.useGlobalFilters(new CustomExceptionFilter());
		const logger = new LoggerService('Server');
		app.useLogger(logger);
		await app.init();
	});

	describe('POST stores/me/ingredients', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/me/ingredients')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({name: 'cucumber', quantity: 12})
				.expect(201);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.post('/stores/me/ingredients')
				.expect(401);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/stores/me/ingredients')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({oops: 'hello'})
				.expect(400);
		});
	});

	describe('GET stores/me/ingredients', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores/me/ingredients')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.get('/stores/me/ingredients')
				.expect(401);
		});
	});

	describe('GET stores/me/ingredients/:uuid', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores/me/ingredients/a7859141-7d67-403c-99f5-6f10b36c7dc')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.get('/stores/me/ingredients/a7859141-7d67-403c-99f5-6f10b36c7dc')
				.expect(401);
		});
	});

	describe('GET stores/:storeUuid/ingredients', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores/9c1e887c-4a77-47ca-a572-c9286d6b7cea/ingredients')
				.expect(200);
		});

		it('should return a HTTP 401 status code when query param is not an UUID', () => {
			return request(app.getHttpServer())
				.get('/stores/uususu/ingredients')
				.expect(400);
		});
	});

	describe('GET stores/me/ingredients/:uuid', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores/9c1e887c-4a77-47ca-a572-c9286d6b7cea/ingredients/9c1e887c-4a77-47ca-a572-c9286d6b7cea')
				.expect(200);
		});

		it('should return a HTTP 401 status code when Store query param is not an UUID', () => {
			return request(app.getHttpServer())
				.get('/stores/hey/ingredients/a7859141-7d67-403c-99f5-6f10b36c7dc')
				.expect(400);
		});

		it('should return a HTTP 401 status code when Ingredient query param is not an UUID', () => {
			return request(app.getHttpServer())
				.get('/stores/9c1e887c-4a77-47ca-a572-c9286d6b7cea/ingredients/hello')
				.expect(400);
		});
	});

	describe('PATCH stores/me/ingredients/:uuid', () => {
		it('should return a HTTP 204 status code when successful', () => {
			return request(app.getHttpServer())
				.patch('/stores/me/ingredients/' + mocks.ingredientRepository.data[0].uuid)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({name: 'cucumber', quantity: 12})
				.expect(204);
		});

		it('should return a HTTP 404 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.patch('/stores/me/ingredients' + mocks.ingredientRepository.data[0].uuid)
				.expect(404);
		});
	});

	describe('DELETE stores/me/ingredients/:uuid', () => {
		it('should return a HTTP 204 status code when successful', () => {
			return request(app.getHttpServer())
				.delete('/stores/me/ingredients/' + mocks.ingredientRepository.data[0].uuid)
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(204);
		});
		it('should return a HTTP 404 status code when no resource found', () => {
			return request(app.getHttpServer())
				.delete('/stores/me/ingredients' + mocks.ingredientRepository.data[0].uuid)
				.expect(404);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
