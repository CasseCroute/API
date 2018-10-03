import {StoreService} from '@store';
import {Module} from '@nestjs/common';
import {AuthStoreService} from './services/auth.store.service';
import {AuthCustomerService} from './services/auth.customer.service';
import {StoreRepository} from '../store/repository/store.repository';
import {CQRSModule} from '@nestjs/cqrs';
import {CustomerService} from '../customer/customer.service';
import {CustomerRepository} from '../customer/repository/customer.repository';

@Module({
	imports: [
		CQRSModule
	],
	providers: [AuthStoreService, AuthCustomerService, StoreService, CustomerService, StoreRepository, CustomerRepository]
})
export class AuthModule {
}
