import {Test} from '@nestjs/testing';
import {CustomerService, Customer} from '@customer';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';

describe('CustomerService', () => {
	let customerService: CustomerService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [CustomerService, CommandBus,
				{
					provide: getRepositoryToken(Customer),
					useValue: mocks.customerRepository
				},
			]
		}).compile();

		customerService = module.get<CustomerService>(CustomerService);
	});

	describe('createOne()', () => {
		it('should return a JWT', async () => {
			jest.spyOn(customerService, 'createOne').mockImplementation(() => mocks.jwtPayload);
			expect(await customerService.createOne(mocks.customerCreateDto)).toBe(mocks.jwtPayload);
		});
	});

	describe('findOneByEmail()', () => {
		it('should return a customer', async () => {
			jest.spyOn(customerService, 'findOneByEmail').mockImplementation(() => mocks.customerRepository.data[0]);
			expect(await customerService.findOneByEmail(mocks.customerLoginDto)).toBe(mocks.customerRepository.data[0]);
		});
	});

	describe('getPassword()', () => {
		it('should return a password', async () => {
			jest.spyOn(customerService, 'getPassword').mockImplementation(() => mocks.customerRepository.data[0].password);
			expect(await customerService.getPassword(mocks.customerLoginDto)).toBe(mocks.customerRepository.data[0].password);
		});
	});
});
