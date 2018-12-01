import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {BadRequestException} from '@nestjs/common';
import {defer} from 'rxjs';
import {SaveProductPictureUrlCommand} from '@letseat/application/commands/product';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';

/**
 * Handles a SaveProductPictureUrl command.
 */
@CommandHandler(SaveProductPictureUrlCommand)
export class SaveProductPictureUrlHandler implements ICommandHandler<SaveProductPictureUrlCommand> {
	constructor(
		@InjectRepository(ProductRepository)
		private readonly productRepository: ProductRepository) {
	}

	async execute(command: SaveProductPictureUrlCommand, resolve: (value?) => void) {
		defer(async () => {
			return this.productRepository.saveProductPictureUrl(command.storeUuid, command.productUuid, command.imageUrl);
		}).subscribe({
			next: () => resolve(),
			error: err => resolve(Promise.reject(new BadRequestException(err.message))),
		});
	}
}
