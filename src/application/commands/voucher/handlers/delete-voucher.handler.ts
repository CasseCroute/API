import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {DeleteVoucherByUuidCommand} from '../delete-voucher-by-uuid.command';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {VoucherRepository} from '@letseat/infrastructure/repository/voucher.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(DeleteVoucherByUuidCommand)
export class DeleteVoucherByUuidHandler implements ICommandHandler<DeleteVoucherByUuidCommand> {
	async execute(command: DeleteVoucherByUuidCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const voucherRepository = getCustomRepository(VoucherRepository);
		try {
			const storeFound = await storeRepository.findOneByUuid(command.storeUuid) as Store;
			if (!storeFound) {
				return resolve(Promise.reject(new BadRequestException('Store not found')));
			}

			await voucherRepository.deleteVoucherByUuid(storeFound.uuid, command.voucherUuid);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
