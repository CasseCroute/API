import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {LoggerService} from '@letseat/infrastructure/services';
import {OrderController} from '../controllers/order.controller';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import * as mocks from './mocks';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';

describe('Orders HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OrderController],
			providers: [
				CQRSModule,
				CommandBus,
			]
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

	describe('POST /orders', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/orders')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({isGuest: false})
				.expect(200);
		});

		it('should return a HTTP 401 status code when no JWT is provided', () => {
			return request(app.getHttpServer())
				.post('/orders')
				.send({isGuest: false})
				.expect(401);
		});

		it('should return a HTTP 400 status code when no required data is sent', () => {
			return request(app.getHttpServer())
				.post('/orders')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(400);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
