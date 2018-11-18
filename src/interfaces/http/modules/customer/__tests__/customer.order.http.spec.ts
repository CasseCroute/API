import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {AuthService} from '@letseat/infrastructure/authorization';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {Cart} from '@letseat/domains/cart/cart.entity';
import {LoggerService} from '@letseat/infrastructure/services';
import {
	CurrentCustomerOrderController,
	GuestCustomerOrderController
} from '@letseat/interfaces/http/modules/customer/customer.order.controller';

describe('Customer Order HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
				CurrentCustomerOrderController,
				GuestCustomerOrderController
			],
			providers: [
				CQRSModule,
				AuthService,
				CommandBus,
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

	describe('POST /customers/me/orders', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/customers/me/orders')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({isDelivery: false})
				.expect(200);
		});

		it('should return a HTTP 401 status code when no JWT is provided', () => {
			return request(app.getHttpServer())
				.post('/customers/me/orders')
				.send({isGuest: false})
				.expect(401);
		});

		it('should return a HTTP 400 status code when no required data is sent', () => {
			return request(app.getHttpServer())
				.post('/customers/me/orders')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(400);
		});
	});

	describe('POST /customers/guest/orders', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/customers/guest/orders')
				.send({
					storeUuid: 'cb0c83e2-5c52-4b5d-81b0-f4829f4986b8',
					isTakeAway: true,
					cart: [{mealUuid: 'bbe8e2f6-4ed3-4fa1-941a-8941b1658a08', quantity: 2}]
				})
				.expect(201);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/customers/guest/orders')
				.send({error: false})
				.expect(400);
		});

		it('should return a HTTP 400 status code when no required data is sent', () => {
			return request(app.getHttpServer())
				.post('/customers/guest/orders')
				.expect(400);
		});
	});

	describe('GET /customers/me/orders', () => {
		it('should return a HTTP 200 status code when successful with Product', () => {
			return request(app.getHttpServer())
				.get('/customers/me/orders')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it('should return a HTTP 401 status code when no Token is set in Authorization Header', () => {
			return request(app.getHttpServer())
				.get('/customers/me/orders')
				.expect(401);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
