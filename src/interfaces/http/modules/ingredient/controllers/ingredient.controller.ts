import {Controller} from '@nestjs/common';

import {CommandBus} from '@nestjs/cqrs';

@Controller('/ingredients')
export class IngredientController {
	constructor(private readonly commandBus: CommandBus) {
	}

}
