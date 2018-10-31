import {
	BadRequestException,
	Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {Section} from '@letseat/domains/section/section.entity';
import {createSectionValidatorOptions} from '@letseat/domains/section/pipes/section-validator-pipe-options';
import {CreateSectionCommand} from '@letseat/application/commands/section/create-section.command';
import {CreateSectionDto} from '@letseat/domains/section/dtos/create-section.dto';
import {GetStoreSectionsQuery} from '@letseat/application/queries/store/get-store-sections.query';
import {GetStoreSectionByUuidQuery} from '@letseat/application/queries/store/get-store-section-by-uuid.query';
import {isUuid} from '@letseat/shared/utils';

@Controller('stores/me/sections')
export class CurrentStoreSectionsController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async createSection(
		@Req() request: any,
		@Body(new ValidationPipe<Section>(createSectionValidatorOptions))
			section: CreateSectionDto): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new CreateSectionCommand(request.user.uuid, section))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	public async getSections(@Req() request: any): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new GetStoreSectionsQuery(request.user.uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Get(':sectionUuid')
	@UseGuards(AuthGuard('jwt'))
	public async getSectionByUuid(@Req() request: any, @Param('sectionUuid') sectionUuid: string): Promise<any> {
		if (request.user.entity === AuthEntities.Store && isUuid(sectionUuid)) {
			return this.commandBus.execute(new GetStoreSectionByUuidQuery(request.user.uuid, sectionUuid));
		}
		if (!isUuid(sectionUuid)) {
			throw new BadRequestException();
		}
		throw new UnauthorizedException();
	}
}
