import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {StoreIngredientsController} from '../controllers';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService} from '@letseat/infrastructure/authorization';
import {CommandBus, EventPublisher, EventBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';

describe('Store HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
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

		it('should return a HTTP 500 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/stores/me/ingredients')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({oops: 'hello'})
				.expect(500);
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

	afterAll(async () => {
		await app.close();
	});
});
