import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PhotoModule} from '@photo';
import {AppModule} from './app.module';

@Module({
	imports: [TypeOrmModule.forRoot(),
		AppModule,
		PhotoModule
	],
})
export class CoreModule {
}
