import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {LoggerService} from '@letseat/infrastructure/services';
import {CuisineController} from '../controllers/cuisine.controller';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';

describe('Cuisines HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CuisineController],
			providers: [
				CQRSModule,
				CommandBus,
			]
		})
			.overrideProvider(CommandBus).useValue({
				register: jest.fn(),
				execute: jest.fn()
			})
			.compile();

		app = module.createNestApplication();
		app.useGlobalFilters(new CustomExceptionFilter());
		const logger = new LoggerService('Server');
		app.useLogger(logger);
		await app.init();
	});

	describe('GET /cuisines', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/cuisines')
				.expect(200);
		});
	});

	describe('GET /cuisines/:cuisineSlug', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/cuisines/pizza')
				.expect(200);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
