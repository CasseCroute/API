/* tslint:disable:no-unused */
import {getCustomRepository} from 'typeorm';
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {GetVoucherByUuidQuery} from '../get-voucher-by-uuid.query';
import {VoucherRepository} from '@letseat/infrastructure/repository/voucher.repository';
import {Voucher} from '@letseat/domains/voucher/voucher.entity';

@CommandHandler(GetVoucherByUuidQuery)
export class GetVoucherByUuidHandler implements ICommandHandler<GetVoucherByUuidQuery> {
	async execute(command: GetVoucherByUuidQuery, resolve: (value?) => void) {
		try {
			const voucherRepository = getCustomRepository(VoucherRepository);
			const voucher = await voucherRepository.findStoreVoucherByUuid(command.storeUuid, command.voucherUuid) as Voucher;
			const {id, ...data} = voucher;
			resolve(data);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
