import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CreateAssociationDto } from "../models/dtos/create-association.dto";
import { CreateUserDto } from "../models/dtos/create.dto";
import { ListUserDto } from "../models/dtos/list.dto";
import { CreateAssociationUserUseCase } from "../use-cases/create-association.use-case";
import { CreateUserUseCase } from "../use-cases/create.use-case";

@Controller("users")
export class UserController {
	constructor(
		private readonly createUseCase: CreateUserUseCase,
		private readonly createAssociationUseCase: CreateAssociationUserUseCase
	) {}

	@Post()
	async create(@Body() dto: CreateUserDto): Promise<ListUserDto> {
		return await this.createUseCase.execute(dto);
	}

	@Post(":id/groups")
	@HttpCode(204)
	async createAssociation(@Param("id", ParseUUIDPipe) id: string, @Body() dto: CreateAssociationDto): Promise<void> {
		return await this.createAssociationUseCase.execute(id, dto);
	}
}
