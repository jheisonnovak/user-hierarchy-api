import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "../models/dtos/create.dto";
import { ListUserDto } from "../models/dtos/list.dto";
import { CreateUserUseCase } from "../use-cases/create.use-case";

@Controller("users")
export class UserController {
	constructor(private readonly createUseCase: CreateUserUseCase) {}

	@Post()
	async create(@Body() dto: CreateUserDto): Promise<ListUserDto> {
		return await this.createUseCase.execute(dto);
	}
}
