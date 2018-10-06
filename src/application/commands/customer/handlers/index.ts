import {CreateCustomerHandler} from './create-customer.handler';
import {UpdateCustomerHandler} from './update-customer.handler';

export const CustomerCommandHandlers = [
	CreateCustomerHandler,
	UpdateCustomerHandler
];

export {
	CreateCustomerHandler,
	UpdateCustomerHandler
};
