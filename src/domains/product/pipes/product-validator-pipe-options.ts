import {BaseValidatorPipeOptions} from '@letseat/domains/common/pipes/validation.pipe';

export const createProductValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const updateProductValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true,
	whitelist: true
};
