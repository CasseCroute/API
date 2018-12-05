/* tslint:disable:no-unused */
import {getCustomRepository} from 'typeorm';
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetVoucherByCodeQuery} from '../get-voucher-by-code.query';
import {VoucherRepository} from '@letseat/infrastructure/repository/voucher.repository';
import {Voucher} from '@letseat/domains/voucher/voucher.entity';

@CommandHandler(GetVoucherByCodeQuery)
export class GetVoucherByCodeHandler implements ICommandHandler<GetVoucherByCodeQuery> {
	async execute(command: GetVoucherByCodeQuery, resolve: (value?) => void) {
		try {
			const voucherRepository = getCustomRepository(VoucherRepository);
			const voucher = await voucherRepository.findStoreVoucherByCode(command.storeUuid, command.voucherCode) as Voucher;
			const valid = await voucherRepository.isStillValid(voucher.code);
			resolve({...voucher, valid});
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
