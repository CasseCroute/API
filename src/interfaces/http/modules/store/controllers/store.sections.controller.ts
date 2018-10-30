import {
	Body, Controller, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {Section} from '@letseat/domains/section/section.entity';
import {createSectionValidatorOptions} from '@letseat/domains/section/pipes/section-validator-pipe-options';
import {CreateSectionCommand} from '@letseat/application/commands/section/create-section.command';
import {CreateSectionDto} from '@letseat/domains/section/dtos/create-section.dto';

@Controller('stores/me/sections')
export class CurrentStoreSectionsController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async createProduct(
		@Req() request: any,
		@Body(new ValidationPipe<Section>(createSectionValidatorOptions))
			section: CreateSectionDto): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new CreateSectionCommand(request.user.uuid, section))
			: (() => {
				throw new UnauthorizedException();
			})();
	}
}

