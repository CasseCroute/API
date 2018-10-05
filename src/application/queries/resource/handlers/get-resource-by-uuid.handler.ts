import {EventPublisher, ICommandHandler, CommandHandler, AggregateRoot} from '@nestjs/cqrs';
import {NotFoundException} from '@nestjs/common';
import {GetResourceByUuidQuery} from '@letseat/application/queries/resource';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {Resource} from '@letseat/domains/resource/resource';

@CommandHandler(GetResourceByUuidQuery)
export class GetResourceByUuidHandler implements ICommandHandler<GetResourceByUuidQuery> {
	constructor(private readonly publisher: EventPublisher) {
	}

	async execute(command: GetResourceByUuidQuery, resolve: (value?) => void) {
		const resource = Resource.register(command);
		const repository = new ResourceRepository();
		try {
			const storeFound = this.publisher.mergeObjectContext(
				await repository.findOneByUuid(resource.uuid) as AggregateRoot
			);
			console.log(storeFound);
			resolve(storeFound);
		} catch (err) {
			err.message = 'Resource not found';
			resolve(Promise.reject(new NotFoundException(err.message)));
		}
	}
}
