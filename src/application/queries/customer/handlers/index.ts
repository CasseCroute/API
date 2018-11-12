import {GetCustomerByEmailHandler} from './get-customer-by-email.handler';
import {GetCustomerPasswordHandler} from './get-customer-password.handler';
import {GetCustomerByUuidHandler} from './get-customer-by-uuid.handler';
import {GetCustomersHandler} from './get-customers.handler';
import {GetCustomerOrdersHandler} from '@letseat/application/queries/customer/handlers/get-customer-orders.handler';

export const CustomerQueryHandlers = [
	GetCustomerByEmailHandler,
	GetCustomerPasswordHandler,
	GetCustomerByUuidHandler,
	GetCustomersHandler,
	GetCustomerOrdersHandler
];

export {
	GetCustomerByEmailHandler,
	GetCustomerPasswordHandler,
	GetCustomerByUuidHandler,
	GetCustomersHandler,
	GetCustomerOrdersHandler
};
