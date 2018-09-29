import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PhotoModule} from './photo.module';
import {PhotoService} from './photo.service';
import {Connection} from 'typeorm';

@Module({
	imports: [TypeOrmModule.forRoot(),
		PhotoModule
	],
	controllers: [AppController],
	providers: [AppService, PhotoService],
})
export class CoreModule {
	constructor(private readonly connection: Connection) {
	}
}
