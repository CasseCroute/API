import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {
	CurrentStoreSectionsController,
} from '../controllers';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService} from '@letseat/infrastructure/authorization';
import {CommandBus, EventPublisher, EventBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {LoggerService} from '../../../../../infrastructure/services';

describe('Store Sections HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
				CurrentStoreSectionsController
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
				}
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

	describe('POST stores/me/sections', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/me/sections')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({name: 'Our Burgers'})
				.expect(201);
		});

		it('should return a HTTP 201 status code when successful with Products', () => {
			return request(app.getHttpServer())
				.post('/stores/me/sections')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					name: 'Our Burgers',
					products: [
						'55a724d7-5106-42bc-8183-fcc85717a230',
						'6bf1c66d-6850-4ad4-9001-7d6859a3c997'
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when successful with Meals', () => {
			return request(app.getHttpServer())
				.post('/stores/me/sections')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					name: 'Our Burgers',
					meals: [
						'55a724d7-5106-42bc-8183-fcc85717a230',
						'6bf1c66d-6850-4ad4-9001-7d6859a3c997'
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when successful with Meals and Products', () => {
			return request(app.getHttpServer())
				.post('/stores/me/sections')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					name: 'Our Burgers',
					meals: [
						'55a724d7-5106-42bc-8183-fcc85717a230',
						'6bf1c66d-6850-4ad4-9001-7d6859a3c997'
					],
					products: [
						'55a724d7-5106-42bc-8183-fcc85717a230',
						'6bf1c66d-6850-4ad4-9001-7d6859a3c997'
					]
				})
				.expect(201);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.post('/stores/me/sections')
				.expect(401);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/stores/me/sections')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({oops: 'hello'})
				.expect(400);
		});

		describe('GET stores/me/sections/:uuid', () => {
			it('should return a HTTP 200 status code when successful', () => {
				return request(app.getHttpServer())
					.get(`/stores/me/sections/${mocks.sectionRepository.data[0].uuid}`)
					.set('Authorization', `Bearer ${mocks.token}`)
					.expect(200);
			});

			it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
				return request(app.getHttpServer())
					.get(`/stores/me/sections/${mocks.sectionRepository.data[0].uuid}`)
					.expect(401);
			});

			it('should return a HTTP 400 status code when Section query param is not an UUID', () => {
				return request(app.getHttpServer())
					.get('/stores/me/sections/hello')
					.set('Authorization', `Bearer ${mocks.token}`)
					.expect(400);
			});
		});

		describe('GET stores/me/sections', () => {
			it('should return a HTTP 200 status code when successful', () => {
				return request(app.getHttpServer())
					.get('/stores/me/sections')
					.set('Authorization', `Bearer ${mocks.token}`)
					.expect(200);
			});

			it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
				return request(app.getHttpServer())
					.get('/stores/me/sections')
					.expect(401);
			});
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
