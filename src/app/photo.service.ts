import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Photo} from './photo.entity';

@Injectable()
export class PhotoService {
	constructor(@InjectRepository(Photo) private readonly photoRepository: Repository<Photo>) {
	}

	async findAll(): Promise<Photo[]> {
		return this.photoRepository.find();
	}

	async createOne(): Promise<Photo> {
		const user = this.photoRepository.create({
			name: 'Photo',
			description: 'helolo',
			filename: 'okkk',
			views: 1,
			isPublished: true
		});

		return this.photoRepository.save(user);
	}
}
