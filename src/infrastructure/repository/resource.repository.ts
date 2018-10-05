import {getConnection} from 'typeorm';
import {Store} from '@letseat/domains/store/store.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ResourceRepository {
	public async findOneByUuid(resourceUuid: string) {
		const resource = await getConnection()
			.createQueryBuilder()
			.select('store')
			.from(Store, 'store')
			.where('store.uuid = :uuid', {uuid: resourceUuid})
			.getOne();
		delete resource!.id;
		return resource;
	}
}
