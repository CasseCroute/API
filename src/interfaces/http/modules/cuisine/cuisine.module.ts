import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {Cuisine} from '@letseat/domains/cuisine/cuisine.entity';
import {CuisineQueryHandlers} from '@letseat/application/queries/cuisine/handlers';
import {CuisineController} from '@letseat/interfaces/http/modules/cuisine/controllers/cuisine.controller';
import {CuisineRepository} from '@letseat/infrastructure/repository/cuisine.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([Cuisine, CuisineRepository]),
		CQRSModule
	],
	providers: [
		...CuisineQueryHandlers,
	],
	controllers: [
		CuisineController
	]
})
export class CuisineModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
	) {}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);
		this.command$.register(CuisineQueryHandlers);
	}
}
