import {Body, Controller, HttpCode, NotFoundException, Post, UnauthorizedException} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {
	CustomerValidationPipe,
	customerLoginValidatorOptions,
	customerRegisterValidatorOptions
} from '@letseat/domains/customer/pipes';
import {AuthService, CryptographerService, JwtPayload} from '@letseat/infrastructure/authorization';
import {CreateCustomerDto, LoginCustomerDto} from '@letseat/domains/customer/dtos';
import {CreateCustomerCommand} from '@letseat/application/commands/customer';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {GetCustomerByEmailQuery, GetCustomerPasswordQuery} from '@letseat/application/queries/customer';

@Controller('customers')
export class CustomerController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post('/register')
	public async register(@Body(new CustomerValidationPipe(customerRegisterValidatorOptions)) customer: CreateCustomerDto): Promise<JwtPayload> {
		return this.commandBus.execute(new CreateCustomerCommand(customer));
	}

	@Post('/login')
	@HttpCode(200)
	public async login(@Body(new CustomerValidationPipe(customerLoginValidatorOptions)) customer: LoginCustomerDto): Promise<any> {
		return new Promise<any>(async (resolve: any, reject: any) => {
			return this.commandBus.execute(new GetCustomerByEmailQuery(customer.email))
				.then(async (customerFound: Customer) => {
					const customerSelect = await this.commandBus.execute(new GetCustomerPasswordQuery(customerFound));
					await CryptographerService.comparePassword(customer.password, customerSelect.password)
						? resolve(AuthService.createToken<Customer>(customerFound))
						: reject(new UnauthorizedException('Invalid password'));
				})
				.catch(() => reject(new NotFoundException('Customer doesn\'t exists')));
		});
	}
}
