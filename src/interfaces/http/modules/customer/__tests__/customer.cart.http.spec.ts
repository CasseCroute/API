import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus, EventPublisher, EventBus, CQRSModule} from '@nestjs/cqrs';
import {AuthService} from '@letseat/infrastructure/authorization';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {APIKeyStrategy} from '@letseat/infrastructure/authorization/strategies/api-key.strategy';
import {CurrentCustomerCartController} from '../customer.cart.controller';
import {CustomExceptionFilter} from '../../../../../domains/common/exceptions';
import {Cart} from '@letseat/domains/cart/cart.entity';
import {LoggerService} from '../../../../../infrastructure/services';

describe('Customer Cart HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CurrentCustomerCartController],
			providers: [
				CQRSModule,
				AuthService,
				CommandBus,
				EventPublisher,
				EventBus,
				{
					provide: getRepositoryToken(Customer),
					useValue: mocks.customerRepository,
				},
				{
					provide: getRepositoryToken(Cart),
					useValue: mocks.customerRepository,
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
			.overrideProvider(APIKeyStrategy).useClass(mocks.ApiKeyStrategyMock)
			.compile();

		app = module.createNestApplication();
		app.useGlobalFilters(new CustomExceptionFilter());
		const logger = new LoggerService('Server');
		app.useLogger(logger);
		await app.init();
	});

	describe('POST /add', () => {
		it('should return a HTTP 200 status code when successful with Product', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/add')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({productUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc', quantity: 2})
				.expect(200);
		});

		it('should return a HTTP 200 status code when successful with Meal', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/add')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({mealUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc', quantity: 2})
				.expect(200);
		});

		it('should return a HTTP 400 status code when mealUuid and productUuid are provided', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/add')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({mealUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc', productUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc', quantity: 2})
				.expect(400);
		});

		it('should return a HTTP 200 status code when successful with Options', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/add')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({mealUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc', quantity: 2, optionUuids: ['2911d618-ef48-4a50-b388-2fbf081bf1fc']})
				.expect(200);
		});

		it('should return a HTTP 401 status code when no Token is set in Authorization Header', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/add')
				.send({productUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc', quantity: 2})
				.expect(401);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/add')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({zz: '2911d618-ef48-4a50-b388-2fbf081bf1fc', quantity: 2})
				.expect(400);
		});

		it('should return a no empty body when successful', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/add')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({productUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc', quantity: 2})
				.expect(res => {
					return res.body !== null;
				});
		});
	});

	describe('POST /remove', () => {
		it('should return a HTTP 200 status code when successful with Product', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/remove')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({productUuid: 'd7499e55-e191-4a93-947f-3d37f26ec55c'})
				.expect(200);
		});

		it('should return a HTTP 200 status code when successful with Meal', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/remove')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({mealUuid: '7cc03c19-8029-4a7d-ada8-edc5e741b6e2'})
				.expect(200);
		});

		it('should return a HTTP 400 status code when mealUuid and productUuid are provided', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/remove')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({mealUuid: 'd7499e55-e191-4a93-947f-3d37f26ec55c', productUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc'})
				.expect(400);
		});

		it('should return a HTTP 401 status code when no Token is set in Authorization Header', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/remove')
				.send({productUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc'})
				.expect(401);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/remove')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({zz: '2911d618-ef48-4a50-b388-2fbf081bf1fc'})
				.expect(400);
		});

		it('should return a no empty body when successful', () => {
			return request(app.getHttpServer())
				.post('/customers/me/cart/add')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({productUuid: '2911d618-ef48-4a50-b388-2fbf081bf1fc', quantity: 2})
				.expect(res => {
					return res.body !== null;
				});
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
