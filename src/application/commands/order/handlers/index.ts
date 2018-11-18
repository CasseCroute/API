import {UpdateStatusOrderHandler} from '@letseat/application/commands/order/handlers/update-order-status.handler';
import {CreateOrderHandler} from '@letseat/application/commands/order/handlers/create-order.handler';
import {CreateGuestOrderHandler} from '@letseat/application/commands/order/handlers/create-guest-order.handler';

export const OrderCommandHandlers = [
	UpdateStatusOrderHandler,
	CreateOrderHandler,
	CreateGuestOrderHandler
];

export {
	CreateOrderHandler,
	UpdateStatusOrderHandler,
	CreateGuestOrderHandler
};
