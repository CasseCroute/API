import {StoreService} from '@store';
import {Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {StoreRepository} from '../store/repository/store.repository';
import {CQRSModule} from '@nestjs/cqrs';

@Module({
	imports: [
		CQRSModule
	],
	providers: [AuthService, StoreService, StoreRepository]
})
export class AuthModule {
}
