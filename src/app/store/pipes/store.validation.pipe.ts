import {PipeTransform, Injectable, ArgumentMetadata} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate, ValidatorOptions} from 'class-validator';
import {CustomValidationError} from '@common';
import {Store} from '../store.entity';

@Injectable()
export class StoreValidationPipe implements PipeTransform<string, Promise<Store>> {
	private readonly storeValidatorOptions?: StoreValidatorPipeOptions;

	constructor(storeValidatorOptions?: StoreValidatorPipeOptions) {
		this.storeValidatorOptions = storeValidatorOptions;
	}

	async transform(value: any, {metatype}: ArgumentMetadata): Promise<Store> {
		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}
		const object = plainToClass(metatype, value);
		const errors = await validate(object, this.storeValidatorOptions);
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

export interface StoreValidatorPipeOptions extends ValidatorOptions {
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

export const storeRegisterValidatorOptions: StoreValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const storeLoginValidatorOptions: StoreValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};
