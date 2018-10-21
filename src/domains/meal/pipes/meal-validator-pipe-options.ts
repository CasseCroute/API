import {BaseValidatorPipeOptions} from '@letseat/domains/common/pipes/validation.pipe';

export const createMealValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};
