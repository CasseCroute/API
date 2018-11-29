import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {StoreVouchersController} from '../controllers';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService} from '@letseat/infrastructure/authorization';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {LoggerService} from '@letseat/infrastructure/services';

describe('Store HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
				StoreVouchersController
			],
			providers: [
				CQRSModule,
				AuthService,
				CommandBus,
				{
					provide: getRepositoryToken(Store),
					useValue: mocks.storeRepository,
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

	const success = 'should return a HTTP 201 status code when successful';
	const missingJwt = 'should return a HTTP 401 status code when no JWT is present in Authorization header';
	const incorrectUrl = 'should return a HTTP 400 status code when incorrect URL is sent';

	describe('POST stores/me/vouchers', () => {
		const url = '/stores/me/vouchers';
		it(success, () => {
			const data = {
				code: 'BLACKFRIDAY10',
				reduction: 5,
				expirationDate: '2018-11-30'
			};

			return request(app.getHttpServer())
				.post(url)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send(data)
				.expect(201);
		});

		it(missingJwt, () => {
			return request(app.getHttpServer())
				.post(url)
				.send(mocks.voucherRepository.data[0])
				.expect(401);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post(url)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({serial: '2X0NFW-E6M36H-AAFLPC-GPS81M'})
				.expect(400);
		});
	});

	describe('DELETE stores/me/vouchers/:uuid', () => {
		const url = '/stores/me/vouchers/' + mocks.voucherRepository.data[0].uuid;

		it(success, () => {
			return request(app.getHttpServer())
				.delete(url)
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(204);
		});

		it(missingJwt, () => {
			return request(app.getHttpServer())
				.delete(url)
				.expect(401);
		});

		it(incorrectUrl, () => {
			return request(app.getHttpServer())
				.delete(url + 'toto')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(400);
		});
	});

	describe('GET stores/me/vouchers/:uuid', () => {
		const url = '/stores/me/vouchers/' + mocks.voucherRepository.data[0].uuid;

		it(success, () => {
			return request(app.getHttpServer())
				.get(url)
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it(missingJwt, () => {
			return request(app.getHttpServer())
				.get(url)
				.expect(401);
		});

		it(incorrectUrl, () => {
			return request(app.getHttpServer())
				.get(url + 'toto')
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(400);
		});
	});

	describe('GET stores/me/vouchers/code/:voucherCode', () => {
		const url = '/stores/me/vouchers/code/' + mocks.voucherRepository.data[0].code;

		it(success, () => {
			return request(app.getHttpServer())
				.get(url)
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(200);
		});

		it(missingJwt, () => {
			return request(app.getHttpServer())
				.get(url)
				.expect(401);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
