import {Test} from '@nestjs/testing';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
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
});
