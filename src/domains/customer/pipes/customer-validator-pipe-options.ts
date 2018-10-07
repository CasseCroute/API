import {BaseValidatorPipeOptions} from '@letseat/domains/common/pipes/validation.pipe';

export const customerRegisterValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const customerLoginValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const customerUpdateValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true,
	whitelist: true
};
