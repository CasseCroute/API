import {ICommand} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';

export class GetStoresQuery extends Store implements ICommand {
}
