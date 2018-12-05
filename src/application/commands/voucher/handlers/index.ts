import {CreateVoucherHandler} from './create-voucher.handler';
import {DeleteVoucherByUuidHandler} from './delete-voucher.handler';

export const VoucherCommandHandlers = [
	CreateVoucherHandler,
	DeleteVoucherByUuidHandler
];

export {
	CreateVoucherHandler,
	DeleteVoucherByUuidHandler
};
