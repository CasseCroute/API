import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {CustomerController, CustomerService} from '@customer';
import * as mocks from './mocks';
import {AuthCustomerService, CryptographerService} from '@auth';

describe('Customer', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CustomerController],
			providers: [CustomerService, AuthCustomerService]
		})
			.overrideProvider(CustomerService).useValue(mocks.customerService)
			.overrideProvider(AuthCustomerService).useValue(mocks.authService)
			.compile();

		app = module.createNestApplication();
		await app.init();
	});

	describe('POST /register', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/customer/register')
				.send(mocks.customerCreateDto)
				.expect(201);
		});
	});

	describe('POST /login', () => {
		it('should return a HTTP 200 status code when successful', () => {
			jest.spyOn(CryptographerService, 'comparePassword')
				.mockImplementation(mocks.cryptographerService.comparePassword);
			return request(app.getHttpServer())
				.post('/customer/login')
				.send(mocks.customerLoginDto)
				.expect(200);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
