import {ICommand} from '@nestjs/cqrs';
import {Customer} from '@letseat/domains/customer/customer.entity';

export class GetCustomersQuery extends Customer implements ICommand {
}
