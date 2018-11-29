import {EntityRepository, Repository} from 'typeorm';
import {Voucher} from '@letseat/domains/voucher/voucher.entity';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {CreateVoucherDto} from '@letseat/domains/voucher/dtos';
import {Store} from '@letseat/domains/store/store.entity';

@EntityRepository(Voucher)
export class VoucherRepository extends Repository<Voucher> implements ResourceRepository {
	private readonly property = 'voucher.store';

	public async findOneByUuid(voucherUuid: string) {
		return this.findOne({where: {uuid: voucherUuid}});
	}

	public async findStoreVouchers(storeUuid: string) {
		return this.createQueryBuilder('voucher')
			.leftJoin('voucher.store', 'store')
			.where('store.uuid = :storeUuid', {storeUuid})
			.getMany();
	}

	public async findVoucherByCode(voucherCode: string) {
		return this.findOne({where: {code: voucherCode}});
	}

	public async createVoucher(store: Store, voucher: CreateVoucherDto) {
		const newVoucher = new Voucher(voucher);
		newVoucher.store = store;
		return this.save(newVoucher);
	}

	public async deleteVoucherByUuid(storeUuid: string, voucherUuid: string) {
		return this.createQueryBuilder('voucher')
			.leftJoinAndSelect(this.property, 'store')
			.where('store.uuid = :storeUuid', {storeUuid})
			.where('voucher.uuid = :voucherUuid', {voucherUuid})
			.delete()
			.execute();

	}

	public async findStoreVoucherByUuid(storeUuid: string, voucherUuid: string) {
		return this.createQueryBuilder('voucher')
			.leftJoin(this.property, 'store')
			.where('store.uuid = :storeUuid AND voucher.uuid = :voucherUuid', {storeUuid, voucherUuid})
			.getOne();
	}

	public async findStoreVoucherByCode(storeUuid: string, voucherCode: string) {
		return this.createQueryBuilder('voucher')
			.leftJoin(this.property, 'store')
			.where('store.uuid = :storeUuid AND voucher.code = :voucherCode', {storeUuid, voucherCode})
			.getOne();
	}

	public async isStillValid(voucherCode: string) {
		const voucher = await this.findVoucherByCode(voucherCode) as Voucher;
		const now = new Date();

		return now.getDate() < voucher.expirationDate.getDate();
	}
}
