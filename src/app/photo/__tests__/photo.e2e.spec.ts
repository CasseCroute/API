import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {PhotoService, PhotoController} from '@photo';
import * as mocks from './mocks';

describe('PhotoEndpoints', () => {
	let app: INestApplication;
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PhotoController],
			providers: [PhotoService],
		})
			.overrideProvider(PhotoService)
			.useValue(mocks.photoService)
			.compile();

		app = module.createNestApplication();
		await app.init();
	});

	it('GET /photos', () => {
		return request(app.getHttpServer())
			.get('/photos')
			.expect(200)
			.expect(mocks.photoService.findAll());
	});

	it('POST /photos', () => {
		return request(app.getHttpServer())
			.post('/photos')
			.expect(201);
	});

	afterAll(async () => {
		await app.close();
	});
});
