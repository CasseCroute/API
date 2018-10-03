import {Test} from '@nestjs/testing';
import {CustomerService, Customer} from '@customer';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';

describe('CustomerController', () => {
	let storeService: CustomerService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [CustomerService, CommandBus,
				{
					provide: getRepositoryToken(Customer),
					useValue: mocks.customerRepository
				},
			]
		}).compile();

		storeService = module.get<CustomerService>(CustomerService);
	});

	describe('createOne()', () => {
		it('should return a JWT', async () => {
			jest.spyOn(storeService, 'createOne').mockImplementation(() => mocks.jwtPayload);
			expect(await storeService.createOne(mocks.customerCreateDto)).toBe(mocks.jwtPayload);
		});
	});

	describe('findOneByEmail()', () => {
		it('should return a store', async () => {
			jest.spyOn(storeService, 'findOneByEmail').mockImplementation(() => mocks.customerRepository.data[0]);
			expect(await storeService.findOneByEmail(mocks.customerLoginDto)).toBe(mocks.customerRepository.data[0]);
		});
	});

	describe('getPassword()', () => {
		it('should return a password', async () => {
			jest.spyOn(storeService, 'getPassword').mockImplementation(() => mocks.customerRepository.data[0].password);
			expect(await storeService.getPassword(mocks.customerLoginDto)).toBe(mocks.customerRepository.data[0].password);
		});
	});
});
