import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Photo} from './photo.entity';

@Injectable()
export class PhotoService {
	constructor(@InjectRepository(Photo) private readonly photoRepository: Repository<Photo>) {
	}

	public async findAll(): Promise<Photo[]> {
		return this.photoRepository.find();
	}

	public async createOne(): Promise<Photo> {
		const photo = this.photoRepository.create({
			name: 'Photo',
			description: 'hello',
			filename: 'hello.jpg',
			views: 1,
			isPublished: true
		});

		return this.photoRepository.save(photo);
	}
}
