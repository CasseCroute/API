import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CreateStoreCommand} from '../create-store.command';
import {InjectRepository} from '@nestjs/typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {AuthService, CryptographerService} from '@letseat/infrastructure/authorization';
import {slugify} from '@letseat/shared/utils';
import {Store} from '@letseat/domains/store/store.entity';
import {GeocoderService} from '@letseat/infrastructure/services/geocoder.service';

@CommandHandler(CreateStoreCommand)
export class CreateStoreHandler implements ICommandHandler<CreateStoreCommand> {
	constructor(
		@InjectRepository(StoreRepository)
		private readonly storeRepository: StoreRepository,
		private readonly geocoderService: GeocoderService) {
	}

	async execute(command: CreateStoreCommand, resolve: (value?) => void) {
		command.password = await CryptographerService.hashPassword(command.password);
		command.slug = slugify(command.name);
		const entry = await this.geocoderService.geocodeAddress(`${command.address.street} ${command.address.city} ${command.address.zipCode} ${command.address.country}`);
		if (entry.length > 0) {
			command.address.latitude = entry[0].latitude;
			command.address.longitude = entry[0].longitude;
		}
		try {
			const storeSaved = await this.storeRepository.saveStore(command as any);
			const jwt = AuthService.createToken<Store>(storeSaved);
			resolve(jwt);
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
