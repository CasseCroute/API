/* tslint:disable:no-unused */
import {BadRequestException, Injectable, MulterModuleOptions, MulterOptionsFactory} from '@nestjs/common';
import path from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
	createMulterOptions(): MulterModuleOptions {
		return {
			fileFilter: ((req, file, callback) => {
				const imageRegex = /[\/.](jpg|jpeg|png)$/i;
				if (!imageRegex.test(path.extname(file.originalname))) {
					return callback(new BadRequestException('Only images are allowed'), false);
				}
				callback(null, true);
			})
		};
	}
}
