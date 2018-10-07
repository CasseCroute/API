import {
	Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Req,
	UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {
	CustomerValidationPipe, customerLoginValidatorOptions,
	customerRegisterValidatorOptions, customerUpdateValidatorOptions
} from '@letseat/domains/customer/pipes';
import {AuthService, CryptographerService, JwtPayload} from '@letseat/infrastructure/authorization';
import {CreateCustomerDto, LoginCustomerDto} from '@letseat/domains/customer/dtos';
import {CreateCustomerCommand, UpdateCustomerCommand} from '@letseat/application/commands/customer';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {
	DeleteCustomerByUuidQuery,
	GetCustomerByEmailQuery, GetCustomerByUuidQuery, GetCustomerPasswordQuery
} from '@letseat/application/queries/customer';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {UpdateCustomerDto} from '@letseat/domains/customer/dtos/update-customer.dto';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {GetCustomersQuery} from '@letseat/application/queries/customer/get-customers.query';

@Controller('customers')
export class CustomerController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Get('/me')
	@UseGuards(AuthGuard('jwt'))
	public async currentUser(@Req() request: any) {
		return this.commandBus.execute(new GetCustomerByUuidQuery(request.user.uuid));
	}

	@Get('/')
	@UseGuards(AuthGuard('headerapikey'))
	public async getAll() {
		return this.commandBus.execute(new GetCustomersQuery());
	}

	@Get(':uuid')
	@UseGuards(AuthGuard('headerapikey'))
	public async getOneByUuid(@Param('uuid') uuid: string) {
		return this.commandBus.execute(new GetCustomerByUuidQuery(uuid));
	}

	@Patch('/me')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async updateCurrentUser(
		@Req() request: any,
		@Body(new CustomerValidationPipe(customerUpdateValidatorOptions)) valuesToUpdate: UpdateCustomerDto) {
		return request.user.entity === AuthEntities.Customer
			? this.commandBus.execute(new UpdateCustomerCommand(request.user.uuid, valuesToUpdate))
			: (() => {
				throw new UnauthorizedException();
			})();
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

	@Delete('/me')
	@UseGuards(AuthGuard('jwt'))
	public async deleteCurrentUser(@Req() request: any) {
		return this.commandBus.execute(new DeleteCustomerByUuidQuery(request.user.uuid));
	}
}
