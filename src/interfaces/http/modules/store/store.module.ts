/* tslint:disable:no-unused */
import {BadRequestException, Module, MulterModule, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';
import {StoreCommandHandlers} from '@letseat/application/commands/store/handlers';
import {StoreQueryHandlers} from '@letseat/application/queries/store/handlers';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {ResourceQueryHandlers} from '@letseat/application/queries/resource/handlers';
import {IngredientCommandHandlers} from '@letseat/application/commands/ingredient/handlers';
import {StoreControllers} from '@letseat/interfaces/http/modules/store/controllers';
import {ProductCommandHandlers} from '@letseat/application/commands/product/handlers';
import {MealCommandHandlers} from '@letseat/application/commands/meal/handlers';
import {MealsQueryHandlers} from '@letseat/application/queries/meal/handlers';
import {SectionCommandHandlers} from '@letseat/application/commands/section/handlers';
import {ProductIngredientRepository} from '@letseat/infrastructure/repository/product-ingredient.repository';
import {LoggerService} from '@letseat/infrastructure/services';
import {OrderCommandHandlers} from '@letseat/application/commands/order/handlers';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {GeocoderService} from '@letseat/infrastructure/services/geocoder.service';
import {AWSService} from '@letseat/infrastructure/services/aws.service';
import multerS3 from 'multer-s3';
import path from 'path';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Store,
			StoreRepository,
			ProductIngredientRepository,
			OrderRepository,
			CustomerRepository,
		]),
		CQRSModule,
		MulterModule.register({
			storage: multerS3({
				s3: new AWSService().S3,
				bucket: 'lets-eat-co/stores',
				metadata: (req, file, callback) => callback(null, {fieldName: file.fieldname}),
				key: (req: any, file, callback) => callback(null, req.user.uuid),
				acl: 'public-read',
				contentType: multerS3.AUTO_CONTENT_TYPE,
			}),
			fileFilter: ((req, file, callback) => {
				const imageRegex = /[\/.](jpg|jpeg|png)$/i;
				if (!imageRegex.test(path.extname(file.originalname))) {
					return callback(new BadRequestException('Only images are allowed'), false);
				}
				callback(null, true);
			})
		}),
	],
	providers: [
		JwtStrategy,
		...ResourceQueryHandlers,
		...StoreCommandHandlers,
		...StoreQueryHandlers,
		...IngredientCommandHandlers,
		...ProductCommandHandlers,
		...MealCommandHandlers,
		...MealsQueryHandlers,
		...SectionCommandHandlers,
		...OrderCommandHandlers,
		GeocoderService,
		LoggerService,
		AWSService,
	],
	controllers: [
		...StoreControllers
	]
})
export class StoreModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
	) {
	}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);

		this.command$.register(StoreCommandHandlers);
		this.command$.register(IngredientCommandHandlers);
		this.command$.register(StoreQueryHandlers);
		this.command$.register(ResourceQueryHandlers);
		this.command$.register(ProductCommandHandlers);
		this.command$.register(MealCommandHandlers);
		this.command$.register(SectionCommandHandlers);
		this.command$.register(OrderCommandHandlers);
	}
}
