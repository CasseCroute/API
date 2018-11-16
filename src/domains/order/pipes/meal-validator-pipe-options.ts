import {BaseValidatorPipeOptions} from '@letseat/domains/common/pipes/validation.pipe';

export const createOrderValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};

export const updateOrderValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true,
	whitelist: true
};
