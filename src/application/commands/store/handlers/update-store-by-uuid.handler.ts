/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {UpdateStoreByUuidCommand} from '@letseat/application/commands/store';
import {Store} from '@letseat/domains/store/store.entity';
import {slugify} from '@letseat/shared/utils';
import {AddressRepository} from '@letseat/infrastructure/repository/address.repository';

@CommandHandler(UpdateStoreByUuidCommand)
export class UpdateStoreByUuidHandler implements ICommandHandler<UpdateStoreByUuidCommand> {
	async execute(command: UpdateStoreByUuidCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const addressRepository = getCustomRepository(AddressRepository);
		const store = Store.register(command);
		if (command.hasOwnProperty('name')) {
			store.slug = slugify(command.name);
		}
		const {uuid, address, ...valuesToUpdate} = store;
		try {
				await storeRepository.updateStore(store.uuid, valuesToUpdate);
			if (address) {
				const addressFound = await storeRepository.getAddress(store.uuid);
				await addressRepository.updateAddress(addressFound, address);
			}
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
