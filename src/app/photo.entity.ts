import {Entity, Column, PrimaryGeneratedColumn, Generated} from 'typeorm';

@Entity()
export class Photo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({length: 500})
	name: string;

	@Column('text')
	description: string;

	@Column()
	filename: string;

	@Column('int')
	views: number;

	@Column()
	isPublished: boolean;
}
