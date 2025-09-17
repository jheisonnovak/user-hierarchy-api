import { Body, Controller, Post } from "@nestjs/common";
import { CreateGroupDto } from "../models/dtos/create.dto";
import { ListGroupDto } from "../models/dtos/list.dto";
import { CreateGroupUseCase } from "../use-cases/create.use-case";

@Controller("groups")
export class GroupController {
	constructor(private readonly createUseCase: CreateGroupUseCase) {}

	@Post()
	async createGroup(@Body() dto: CreateGroupDto): Promise<ListGroupDto> {
		return await this.createUseCase.execute(dto);
	}
}
