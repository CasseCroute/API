import {BaseValidatorPipeOptions} from '@letseat/domains/common/pipes/validation.pipe';

export const createIngredientValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};
