import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { ListHierarchyDto } from "../../hierarchy/models/dtos/list.dto";
import { CreateAssociationDto } from "../models/dtos/create-association.dto";
import { CreateUserDto } from "../models/dtos/create.dto";
import { ListUserDto } from "../models/dtos/list.dto";
import { CreateAssociationUserUseCase } from "../use-cases/create-association/create-association.use-case";
import { CreateUserUseCase } from "../use-cases/create/create.use-case";
import { FindOrganizationsUseCase } from "../use-cases/find-organizations/find-organizations.use-case";

@Controller("users")
export class UserController {
	constructor(
		private readonly createUseCase: CreateUserUseCase,
		private readonly createAssociationUseCase: CreateAssociationUserUseCase,
		private readonly findOrganizationsUseCase: FindOrganizationsUseCase
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

	@Get(":id/organizations")
	async findOrganizations(@Param("id", ParseUUIDPipe) id: string): Promise<ListHierarchyDto[]> {
		return await this.findOrganizationsUseCase.execute(id);
	}
}
