/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetVouchersQuery} from '../get-vouchers.query';
import {getCustomRepository} from 'typeorm';
import {VoucherRepository} from '@letseat/infrastructure/repository/voucher.repository';

@CommandHandler(GetVouchersQuery)
export class GetVouchersHandler implements ICommandHandler<GetVouchersQuery> {
	async execute(command: GetVouchersQuery, resolve: (value?) => void) {
		try {
			const voucherRepository = getCustomRepository(VoucherRepository);
			const vouchers = await voucherRepository.findStoreVouchers(command.storeUuid);
			resolve(vouchers.map(({id, ...columns}) => columns));
			resolve(command);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
