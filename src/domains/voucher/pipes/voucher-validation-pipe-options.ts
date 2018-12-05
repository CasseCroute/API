import {BaseValidatorPipeOptions} from '@letseat/domains/common/pipes/validation.pipe';

export const voucherRegisterValidatorOptions: BaseValidatorPipeOptions = {
	skipMissingProperties: false,
	whitelist: true,
	forbidUnknownValues: true,
	forbidNonWhitelisted: true
};
