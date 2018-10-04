import {ICommand} from '@nestjs/cqrs';
import {Store} from '@store';

export class GetStoresQuery extends Store implements ICommand {
}
