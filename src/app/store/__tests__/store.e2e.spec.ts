import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {StoreController} from '../store.controller';
import {StoreService} from '../store.service';
import * as mocks from './mocks';

describe('Store', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StoreController],
			providers: [StoreService],
		})
			.overrideProvider(StoreService)
			.useValue(mocks.storeService)
			.compile();

		app = module.createNestApplication();
		await app.init();
	});

	describe('POST /register', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/register')
				.send(mocks.userCreateDto)
				.expect(201);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});