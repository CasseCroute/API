import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CustomerController} from '../customer.controller';
import {CommandBus, EventPublisher, EventBus, CQRSModule} from '@nestjs/cqrs';
import {AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {GetCustomerByEmailQuery} from '@letseat/application/queries/customer';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';

describe('Customer HTTP Requests', () => {
	let app: INestApplication;
	let commandBus: CommandBus;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CustomerController],
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
		commandBus = module.get<CommandBus>(CommandBus);
		await app.init();
	});

	describe('POST /register', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/customers/register')
				.send(mocks.customerCreateDto)
				.expect(201);
		});
	});

	describe('GET /me', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/customers/me')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it('should return a HTTP 401 status code when no JWT is present in Authorization header', () => {
			return request(app.getHttpServer())
				.get('/customers/me')
				.expect(401);
		});
	});

	describe('POST /login', () => {
		it('should return a HTTP 200 status code when successful', () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.commandBus.findOneByEmail(mocks.customerRepository.data[0]));
			jest.spyOn(CryptographerService, 'comparePassword')
				.mockImplementation(mocks.cryptographerService.comparePassword);
			return request(app.getHttpServer())
				.post('/customers/login')
				.send(mocks.customerLoginDto as Customer)
				.expect(200);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
