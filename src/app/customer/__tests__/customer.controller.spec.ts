import {Test} from '@nestjs/testing';
import {CustomerController, CustomerService, Customer} from '@customer';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {AuthCustomerService} from '@auth';

describe('StoreController', () => {
	let customerController: CustomerController;
	let customerService: CustomerService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [CustomerController],
			providers: [CustomerService, CommandBus, AuthCustomerService,
				{
					provide: getRepositoryToken(Customer),
					useValue: mocks.customerRepository
				},
			]
		})
			.overrideProvider(AuthCustomerService).useValue(mocks.authService)
			.compile();

		customerController = module.get<CustomerController>(CustomerController);
		customerService = module.get<CustomerService>(CustomerService);
	});

	describe('register()', () => {
		it('should return a JWT', async () => {
			jest.spyOn(customerService, 'createOne').mockImplementation(() => mocks.jwtPayload);
			expect(await customerController.register(mocks.customerCreateDto)).toBe(mocks.jwtPayload);
		});
	});
});
