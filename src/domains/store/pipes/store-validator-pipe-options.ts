import {BaseValidatorPipeOptions} from '@letseat/domains/common/pipes/validation.pipe';

export const storeRegisterValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const storeLoginValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const storeUpdateValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true,
	whitelist: true
};
