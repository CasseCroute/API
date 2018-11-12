import {CreateCustomerHandler} from './create-customer.handler';
import {UpdateCustomerHandler} from './update-customer.handler';
import {DeleteCustomerByUuidHandler} from './delete-customer-by-uuid.handler';
import {CreateOrderHandler} from '@letseat/application/commands/customer/handlers/create-order.handler';

export const CustomerCommandHandlers = [
	CreateCustomerHandler,
	UpdateCustomerHandler,
	DeleteCustomerByUuidHandler,
	CreateOrderHandler,
];

export {
	CreateCustomerHandler,
	UpdateCustomerHandler,
	DeleteCustomerByUuidHandler,
	CreateOrderHandler
};
