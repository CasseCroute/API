import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PhotoModule} from '@photo';
import {AppModule} from './app.module';
import {StoreModule} from '@store';

@Module({
	imports: [TypeOrmModule.forRoot(),
		AppModule,
		PhotoModule,
		StoreModule
	],
})
export class CoreModule {
}
