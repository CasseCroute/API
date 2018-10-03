import {Body, Controller, HttpCode, NotFoundException, Post, UnauthorizedException} from '@nestjs/common';
import {CustomerService} from './customer.service';
import {CryptographerService, JwtPayload} from '@auth';
import {
	customerLoginValidatorOptions,
	customerRegisterValidatorOptions,
	CustomerValidationPipe
} from './pipes/customer.validation.pipe';
import {CreateCustomerDto} from './dtos';
import {LoginCustomerDto} from '../customer/dtos';
import {Customer} from '@customer';
import {AuthCustomerService} from '../auth/services/auth.customer.service';

@Controller('customer')
export class CustomerController {
	constructor(private readonly customerService: CustomerService, private readonly authService: AuthCustomerService<Customer>) {
	}

	@Post('/register')
	public async register(@Body(new CustomerValidationPipe(customerRegisterValidatorOptions)) customer: CreateCustomerDto): Promise<JwtPayload> {
		return this.customerService.createOne(customer);
	}

	@Post('/login')
	@HttpCode(200)
	public async login(@Body(new CustomerValidationPipe(customerLoginValidatorOptions)) customer: LoginCustomerDto): Promise<any> {
		return new Promise<any>(async (resolve: any, reject: any) => {
			return this.authService.validateResourceByEmail(customer)
				.then(async (customerFound: Customer) => {
					const customerSelect = await this.authService.getPassword(customerFound);
					await CryptographerService.comparePassword(customer.password, customerSelect.password)
						? resolve(AuthCustomerService.createToken<Customer>(customerFound))
						: reject(new UnauthorizedException('Invalid password'));
				})
				.catch(() => reject(new NotFoundException('Customer doesn\'t exists')));
		});
	}
}
