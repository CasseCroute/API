import {BaseValidatorPipeOptions} from '@letseat/domains/common/pipes/validation.pipe';

export const createMealValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const updateMealValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true,
	whitelist: true
};
