import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {StoreController} from '../store.controller';
import {StoreService} from '../store.service';
import * as mocks from './mocks';
import {AuthService, CryptographerService} from '../../auth';

describe('Store', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StoreController],
			providers: [StoreService, AuthService]
		})
			.overrideProvider(StoreService).useValue(mocks.storeService)
			.overrideProvider(AuthService).useValue(mocks.authService)
			.compile();

		app = module.createNestApplication();
		await app.init();
	});

	describe('GET /', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores')
				.expect(200);
		});
	});

	describe('GET /?term=search', () => {
		it('should return a HTTP 200 status code when successful', () => {
			return request(app.getHttpServer())
				.get('/stores?name=BurgerKing')
				.expect(200);
		});
		it('should return a HTTP 422 status code when incorrect', () => {
			return request(app.getHttpServer())
				.get('/stores?incorrect=BurgerKing')
				.expect(422);
		});
	});

	describe('POST /register', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/register')
				.send(mocks.storeCreateDto)
				.expect(201);
		});

		it('should return a HTTP 500 status code when failed', () => {
			return request(app.getHttpServer())
				.post('/stores/register')
				.send({})
				.expect(500);
		});
	});

	describe('POST /login', () => {
		it('should return a HTTP 200 status code when successful', () => {
			jest.spyOn(CryptographerService, 'comparePassword')
				.mockImplementation(mocks.cryptographerService.comparePassword);
			return request(app.getHttpServer())
				.post('/stores/login')
				.send(mocks.storeLoginDto)
				.expect(200);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
