import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {CreateVoucherCommand} from '../create-voucher.command';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {VoucherRepository} from '@letseat/infrastructure/repository/voucher.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(CreateVoucherCommand)
export class CreateVoucherHandler implements ICommandHandler<CreateVoucherCommand> {
	async execute(command: CreateVoucherCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const voucherRepository = getCustomRepository(VoucherRepository);
		try {
			const storeFound = await storeRepository.findOneByUuid(command.storeUuid) as Store;
			const voucherFound = await voucherRepository.findVoucherByCode(command.voucher.code);
			console.log(voucherFound);
			if (!storeFound) {
				return resolve(Promise.reject(new BadRequestException('Store not found')));
			}

			if (voucherFound !== undefined) {
				return resolve(Promise.reject(new BadRequestException('Voucher code still exist!')));
			}

			await voucherRepository.createVoucher(storeFound, command.voucher);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
