import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {
	CurrentStoreProductsController, StoreProductsController,
} from '../controllers';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService} from '@letseat/infrastructure/authorization';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {Product} from '@letseat/domains/product/product.entity';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {LoggerService} from '@letseat/infrastructure/services';
import {AWSService} from '../../../../../infrastructure/services/aws.service';

describe('Store Ingredients HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
				CurrentStoreProductsController,
				StoreProductsController
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
				{
					provide: getRepositoryToken(Product),
					useValue: mocks.productRepository,
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
		await app.init();
	});

	describe('POST stores/me/ingredients', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/me/products')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({reference: 'BURG', name: 'Burger', price: '12'})
				.expect(201);
		});

		it('should return a HTTP 201 status code when successful (with Ingredients)', () => {
			return request(app.getHttpServer())
				.post('/stores/me/products')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'BURG', name: 'Burger', price: '12',
					ingredients: [
						{
							ingredientUuid: 'f5b06da6-e619-4e97-a30e-116872204e11',
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

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/stores/me/products')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({oops: 'hello'})
				.expect(400);
		});
	});

	describe('GET stores/me/products', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores/me/products')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.get('/stores/me/products')
				.expect(401);
		});
	});

	describe('GET stores/:storeUuid/products', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores/9c1e887c-4a77-47ca-a572-c9286d6b7cea/products')
				.expect(200);
		});

		it('should return a HTTP 400 status code when query param is not an UUID', () => {
			return request(app.getHttpServer())
				.get('/stores/uususu/products')
				.expect(400);
		});
	});

	describe('GET stores/:uuid/product/:uuid', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get(`/stores/${mocks.storeRepository.data[0].uuid}/products/${mocks.productRepository.data[0].uuid}`)
				.expect(200);
		});

		it('should return a HTTP 400 status code when Store query param is not an UUID', () => {
			return request(app.getHttpServer())
				.get('/stores/hey/products/a7859141-7d67-403c-99f5-6f10b36c7dc')
				.expect(400);
		});

		it('should return a HTTP 400 status code when Ingredient query param is not an UUID', () => {
			return request(app.getHttpServer())
				.get('/stores/9c1e887c-4a77-47ca-a572-c9286d6b7cea/products/hello')
				.expect(400);
		});
	});

	describe('GET stores/me/products/:uuid', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get(`/stores/${mocks.storeRepository.data[0].uuid}/products/${mocks.productRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it('should return a HTTP 400 status code when Store query param is not an UUID', () => {
			return request(app.getHttpServer())
				.get('/stores/hey/products/a7859141-7d67-403c-99f5-6f10b36c7dc')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(400);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.get(`/stores/me/products/${mocks.productRepository.data[0].uuid}`)
				.expect(401);
		});

		it('should return a HTTP 400 status code when Ingredient query param is not an UUID', () => {
			return request(app.getHttpServer())
				.get('/stores/9c1e887c-4a77-47ca-a572-c9286d6b7cea/products/hello')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(400);
		});
	});

	describe('PATCH stores/me/products/:uuid', () => {
		it('should return a HTTP 204 status code when successful', () => {
			return request(app.getHttpServer())
				.patch('/stores/me/products/' + mocks.productRepository.data[0].uuid)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({name: 'Burger Maxi'})
				.expect(204);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.patch('/stores/me/products/' + mocks.productRepository.data[0].uuid)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({what: 'cucumber'})
				.expect(400);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.patch('/stores/me/products/' + mocks.productRepository.data[0].uuid)
				.expect(401);
		});
	});

	describe('DELETE stores/me/products/:uuid', () => {
		it('should return a HTTP 204 status code when successful', () => {
			return request(app.getHttpServer())
				.delete('/stores/me/products/' + mocks.productRepository.data[0].uuid)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send()
				.expect(204);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.delete('/stores/me/products/' + mocks.productRepository.data[0].uuid)
				.expect(401);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
