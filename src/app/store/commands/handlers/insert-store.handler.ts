import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {InsertStoreCommand} from '../insert-store.command';
import {StoreRepository} from '../../repository/store.repository';
import {Store} from '@store';
import {getConnection} from 'typeorm';
import {AuthService, CryptographerService} from '@auth';
import {UnprocessableEntityException} from '@nestjs/common';

@CommandHandler(InsertStoreCommand)
export class InsertStoreHandler implements ICommandHandler<InsertStoreCommand> {
	constructor(private readonly repository: StoreRepository, private readonly publisher: EventPublisher) {
	}

	async execute(command: InsertStoreCommand, resolve: (value?) => void) {
		const connection = getConnection();
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			command.password = await CryptographerService.hashPassword(command.password);
			const store = Store.register(command);
			const storeSaved = this.publisher.mergeObjectContext(
				await queryRunner.manager.save(store)
			);
			await queryRunner.commitTransaction();
			delete storeSaved.password;
			const jwt = AuthService.createToken<Store>(command);
			storeSaved.commit();
			resolve(jwt);
		} catch (err) {
			await queryRunner.rollbackTransaction();
			resolve(Promise.reject(new UnprocessableEntityException(err.message)));
		} finally {
			await queryRunner.release();
		}

	}
}
