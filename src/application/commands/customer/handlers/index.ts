import {CreateCustomerHandler} from './create-customer.handler';
import {UpdateCustomerHandler} from './update-customer.handler';
import {DeleteCustomerByUuidHandler} from './delete-customer-by-uuid.handler';

export const CustomerCommandHandlers = [
	CreateCustomerHandler,
	UpdateCustomerHandler,
	DeleteCustomerByUuidHandler,
];

export {
	CreateCustomerHandler,
	UpdateCustomerHandler,
	DeleteCustomerByUuidHandler,
};
