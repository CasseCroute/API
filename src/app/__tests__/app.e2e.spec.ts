import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppController} from '../app.controller';
import {AppService} from '../app.service';

describe('App', () => {
	let app: INestApplication;
	const appService = {root: () => 'Hello World!'};
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		})
			.overrideProvider(AppService)
			.useValue(appService)
			.compile();

		app = module.createNestApplication();
		await app.init();
	});

	it('GET /', () => {
		return request(app.getHttpServer())
			.get('')
			.expect(200)
			.expect(appService.root());
	});

	afterAll(async () => {
		await app.close();
	});
});
