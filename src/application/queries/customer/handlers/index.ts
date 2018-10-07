import {GetCustomerByEmailHandler} from './get-customer-by-email.handler';
import {GetCustomerPasswordHandler} from './get-customer-password.handler';
import {GetCustomerByUuidHandler} from './get-customer-by-uuid.handler';
import {GetCustomersHandler} from './get-customers.handler';

export const CustomerQueryHandlers = [
	GetCustomerByEmailHandler,
	GetCustomerPasswordHandler,
	GetCustomerByUuidHandler,
	GetCustomersHandler
];

export {
	GetCustomerByEmailHandler,
	GetCustomerPasswordHandler,
	GetCustomerByUuidHandler,
	GetCustomersHandler
};
