import {GetCustomerByEmailHandler} from './get-customer-by-email.handler';
import {GetCustomerPasswordHandler} from './get-customer-password.handler';
import {GetCustomerByUuidHandler} from './get-customer-by-uuid.handler';
import {GetCustomersHandler} from './get-customers.handler';
import {DeleteCustomerByUuidHandler} from '@letseat/application/queries/customer/handlers/delete-customer-by-uuid.handler';

export const CustomerQueryHandlers = [
	GetCustomerByEmailHandler,
	GetCustomerPasswordHandler,
	GetCustomerByUuidHandler,
	GetCustomersHandler,
	DeleteCustomerByUuidHandler
];

export {
	GetCustomerByEmailHandler,
	GetCustomerPasswordHandler,
	GetCustomerByUuidHandler,
	GetCustomersHandler,
	DeleteCustomerByUuidHandler
};
