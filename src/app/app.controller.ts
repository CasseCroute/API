import {Get, Controller, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {Photo} from './photo.entity';

import {PhotoService} from './photo.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly photoService: PhotoService) {
	}

	@Get()
	root(): string {
		return this.appService.root();
	}

	@Get('/test')
	async findAll(): Promise<Photo[]> {
		return this.photoService.findAll();
	}

	@Post('/test')
	async post(): Promise<Photo> {
		return this.photoService.createOne();
	}
}
