import {Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Resource} from '@letseat/domains/resource/resource';
import {Order} from '@letseat/domains/order/order.entity';

@Entity()
export class OrderStatus {
	@PrimaryGeneratedColumn({unsigned: true})
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({length: 64})
	name: string;
}

@Entity()
export class OrderHistory extends Resource {
	@ManyToOne(() => Order, order => order.history, {primary: true})
	@JoinColumn({name: 'id_order'})
	order: Order;

	@ManyToOne(() => OrderStatus, {primary: true})
	@JoinColumn({name: 'id_status'})
	status: OrderStatus;
}
