import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {NotFoundException} from '@nestjs/common';
import {GetResourceByUuidQuery} from '@letseat/application/queries/resource';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {Resource} from '@letseat/domains/resource/resource';

@CommandHandler(GetResourceByUuidQuery)
export class GetResourceByUuidHandler implements ICommandHandler<GetResourceByUuidQuery> {
	async execute(query: GetResourceByUuidQuery, resolve: (value?) => void) {
		const resource = Resource.register(query);
		const repository = new ResourceRepository();
		try {
			const storeFound =	await repository.findOneByUuid(resource.uuid, query.entity);
			resolve(storeFound);
		} catch (err) {
			err.message = 'Resource not found';
			return resolve(new NotFoundException(err.message));
		}
	}
}
