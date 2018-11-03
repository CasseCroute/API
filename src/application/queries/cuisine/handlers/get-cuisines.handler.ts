/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetCuisinesQuery} from '@letseat/application/queries/cuisine/get-cuisines.query';
import {Cuisine} from '@letseat/domains/cuisine/cuisine.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@CommandHandler(GetCuisinesQuery)
export class GetCuisinesHandler implements ICommandHandler<GetCuisinesQuery> {
	constructor(@InjectRepository(Cuisine) private readonly cuisineRepository: Repository<Cuisine>) {
	}

	async execute(command: GetCuisinesQuery, resolve: (value?) => void) {
		try {
			resolve(await this.cuisineRepository.find());
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
