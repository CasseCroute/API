import {getConnection} from 'typeorm';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ResourceRepository {
	public async findOneByUuid(uuid: string, entity: any) {
		return getConnection()
			.createQueryBuilder()
			.select(entity)
			.from(entity, entity)
			.where(`${entity}.uuid = :uuid`, {uuid})
			.getOne();
	}
}
