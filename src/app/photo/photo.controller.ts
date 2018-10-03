import {Get, Controller, Post} from '@nestjs/common';
import {Photo} from './photo.entity';
import {PhotoService} from './photo.service';

@Controller('photos')
export class PhotoController {
	constructor(
		private readonly photoService: PhotoService) {
	}

	@Get()
	public async findAll(): Promise<Photo[]> {
		return this.photoService.findAll();
	}

	@Post()
	public async post(): Promise<Photo> {
		return this.photoService.createOne();
	}
}
