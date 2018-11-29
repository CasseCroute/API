import {GetVoucherByUuidHandler} from '@letseat/application/queries/voucher/handlers/get-voucher-by-uuid.handler';
import {GetVoucherByCodeHandler} from './get-voucher-by-code.handler';

export const VoucherQueryHandlers = [
	GetVoucherByUuidHandler,
	GetVoucherByCodeHandler
];

export {
	GetVoucherByUuidHandler,
	GetVoucherByCodeHandler
};
