import {Column, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Store} from '@letseat/domains/store/store.entity';
import {Product} from '@letseat/domains/product/product.entity';

@Entity()
export class Cuisine {
	constructor(args?: Cuisine) {
		return Object.assign(this, args);
	}

	@PrimaryGeneratedColumn({unsigned: true})
	id: number;

	@Column()
	@Generated('uuid')
	uuid: string;

	@Column({length: 128})
	name: string;

	@Column({name: 'image_url', length: 256, nullable: true})
	imageUrl?: string;

	@ManyToMany(() => Store, store => store.cuisines)
	@JoinTable({
		name: 'stores_cuisines', joinColumns: [{name: 'id_cuisine'}], inverseJoinColumns: [{name: 'id_store'}]
	})
	stores: Store[];

	@OneToMany(() => Product, product => product.cuisine)
	products: Product[];
}
