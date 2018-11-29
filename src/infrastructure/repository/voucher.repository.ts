import {EntityRepository, Repository} from 'typeorm';
import {Voucher} from '@letseat/domains/voucher/voucher.entity';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {CreateVoucherDto} from '@letseat/domains/voucher/dtos';
import {Store} from '@letseat/domains/store/store.entity';

@EntityRepository(Voucher)
export class VoucherRepository extends Repository<Voucher> implements ResourceRepository {
	public async findOneByUuid(voucherUuid: string) {
		return this.findOne({where: {uuid: voucherUuid}});
	}

	public async findVoucherByCode(voucherCode: string) {
		return this.findOne({where: {code: voucherCode}});
	}

	public async createVoucher(store: Store, voucher: CreateVoucherDto) {
		const newVoucher = new Voucher(voucher);
		newVoucher.store = store;
		return this.save(newVoucher);
	}
}
