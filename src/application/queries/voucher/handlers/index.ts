import {GetVoucherByUuidHandler} from '@letseat/application/queries/voucher/handlers/get-voucher-by-uuid.handler';
import {GetVoucherByCodeHandler} from './get-voucher-by-code.handler';
import {GetVouchersHandler} from './get-vouchers.handler';

export const VoucherQueryHandlers = [
	GetVoucherByUuidHandler,
	GetVoucherByCodeHandler,
	GetVouchersHandler
];

export {
	GetVoucherByUuidHandler,
	GetVoucherByCodeHandler,
	GetVouchersHandler
};
