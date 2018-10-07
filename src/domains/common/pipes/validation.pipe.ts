import {PipeTransform, Injectable, ArgumentMetadata} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate, ValidatorOptions} from 'class-validator';
import {CustomValidationError} from '@letseat/domains/common/exceptions';

@Injectable()
export class ValidationPipe<T> implements PipeTransform<string, Promise<T>> {
	private readonly validatorOptions?: BaseValidatorPipeOptions;

	constructor(validatorOptions?: BaseValidatorPipeOptions) {
		this.validatorOptions = validatorOptions;
	}

	async transform(value: any, {metatype}: ArgumentMetadata): Promise<T> {
		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}
		const object = plainToClass(metatype, value);
		const errors = await validate(object, this.validatorOptions);
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

export interface BaseValidatorPipeOptions extends ValidatorOptions {
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
