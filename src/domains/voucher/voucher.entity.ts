import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Store} from '@letseat/domains/store/store.entity';

@Entity()
export class Voucher extends Resource {
	constructor(args?: any) {
		super();
		return Object.assign(this, args);
	}

	@Column({length: 128})
	code: string;

	@Column('decimal', {precision: 10, scale: 2, unsigned: true})
	reduction: number;

	@Column({length: 256, nullable: true})
	description: string;

	@Column({name: 'expiration_date'})
	expirationDate: Date;

	@ManyToOne(() => Store, store => store.vouchers, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'id_store'})
	store: Store;

	public static register(args: any): Voucher {
		return new Voucher(args);
	}
}
