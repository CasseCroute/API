import {PipeTransform, Injectable, ArgumentMetadata} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate, ValidatorOptions} from 'class-validator';
import {Customer} from '../customer.entity';
import {CustomValidationError} from '@letseat/domains/common/exceptions';

@Injectable()
export class CustomerValidationPipe implements PipeTransform<string, Promise<Customer>> {
	private readonly customerValidatorOptions?: CustomerValidatorPipeOptions;

	constructor(customerValidatorOptions?: CustomerValidatorPipeOptions) {
		this.customerValidatorOptions = customerValidatorOptions;
	}

	async transform(value: any, {metatype}: ArgumentMetadata): Promise<Customer> {
		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}
		const object = plainToClass(metatype, value);
		const errors = await validate(object, this.customerValidatorOptions);
		if (errors.length > 0) {
			throw new CustomValidationError(errors);
		}
		return value;
	}

	private toValidate(metatype: any): boolean {
		const types = [String, Boolean, Number, Array, Object];
		return !types.find(type => metatype === type);
	}
}

export interface CustomerValidatorPipeOptions extends ValidatorOptions {
	skipMissingProperties?: boolean;
	whitelist?: boolean;
	forbidNonWhitelisted?: boolean;
	groups?: string[];
	dismissDefaultMessages?: boolean;
	validationError?: {
		target?: boolean;
		value?: boolean;
	};
	forbidUnknownValues?: boolean;
}

export const customerRegisterValidatorOptions: CustomerValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const customerLoginValidatorOptions: CustomerValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};
