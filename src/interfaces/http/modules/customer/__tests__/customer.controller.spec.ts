import {Test} from '@nestjs/testing';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus, EventBus} from '@nestjs/cqrs';
import {AuthService} from '@letseat/infrastructure/authorization';
import {CustomerController} from '@letseat/interfaces/http/modules/customer/customer.controller';
import {Customer} from '@letseat/domains/customer/customer.entity';

describe('Customer Controller', () => {
	let customerController: CustomerController;
	let commandBus: CommandBus;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [CustomerController],
			providers: [CommandBus, AuthService,
				{
					provide: getRepositoryToken(Customer),
					useValue: mocks.customerRepository
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
			.compile();

		customerController = module.get<CustomerController>(CustomerController);
		commandBus = module.get<CommandBus>(CommandBus);
	});

	describe('register()', () => {
		it('should return a JWT', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.jwtPayload);
			expect(await customerController.register(mocks.customerCreateDto)).toBe(mocks.jwtPayload);
		});
	});

	describe('getOneByUuid()', () => {
		it('should return customer data', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.customerRepository.data[0]);
			expect(await customerController.getOneByUuid(mocks.customerRepository.data[0].uuid)).toBe(mocks.customerRepository.data[0]);
		});

		it('should not return customer data when UUID is incorrect', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.customerRepository.data[1].uuid);
			expect(await customerController
				.getOneByUuid(mocks.customerRepository.data[1].uuid)).not.toBe(mocks.customerRepository.data[0]);
		});
	});

	describe('currentUser()', () => {
		it('should return a Customer when successful', async () => {
			jest.spyOn(commandBus, 'execute').mockImplementation(() => mocks.customerRepository.data[0]);
			expect(await customerController.currentUser({user: mocks.customerRepository.data[0]})).toBe(mocks.customerRepository.data[0]);
		});
	});
});
