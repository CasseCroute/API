import {GetCustomerByEmailHandler} from './get-customer-by-email.handler';
import {GetCustomerPasswordHandler} from './get-customer-password.handler';
import {GetCustomerByUuidHandler} from './get-customer-by-uuid.handler';

export const CustomerQueryHandlers = [
	GetCustomerByEmailHandler,
	GetCustomerPasswordHandler,
	GetCustomerByUuidHandler];

export {
	GetCustomerByEmailHandler,
	GetCustomerPasswordHandler,
	GetCustomerByUuidHandler
};
