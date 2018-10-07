/* tslint:disable:no-unused */
import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetCustomersQuery} from '../get-customers.query';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';

@CommandHandler(GetCustomersQuery)
export class GetStoresHandler implements ICommandHandler<GetCustomersQuery> {
	constructor(private readonly repository: CustomerRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: GetCustomersQuery, resolve: (value?) => void) {
		try {
			const customers = await this.repository.find();
			resolve(customers.map(({id, ...columns}) => columns));
			resolve(command);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
