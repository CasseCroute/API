import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {
	CurrentStoreProductsController,
} from '../controllers';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService} from '@letseat/infrastructure/authorization';
import {CommandBus, EventPublisher, EventBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {Product} from '@letseat/domains/product/product.entity';

describe('Store Ingredients HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
				CurrentStoreProductsController
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
					provide: getRepositoryToken(Product),
					useValue: mocks.productRepository,
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
				.post('/stores/me/products')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({reference: 'BURG', name: 'Burger', price: 12})
				.expect(201);
		});

		it('should return a HTTP 201 status code when successful (with Ingredients)', () => {
			return request(app.getHttpServer())
				.post('/stores/me/products')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'BURG', name: 'Burger', price: 12,
					ingredients: [
						{
							uuid: 'f5b06da6-e619-4e97-a30e-116872204e11',
							quantity: 2
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.post('/stores/me/products')
				.expect(401);
		});

		it('should return a HTTP 500 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/stores/me/products')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({oops: 'hello'})
				.expect(500);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
