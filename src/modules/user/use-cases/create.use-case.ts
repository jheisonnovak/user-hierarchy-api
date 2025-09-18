import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { DataSource } from "typeorm";
import { NodeType } from "../../hierarchy/models/enums/node-type.enum";
import { CreateClosureSelfLinkUseCase } from "../../hierarchy/use-cases/create-closure-self-link.use-case";
import { CreateNodeUseCase } from "../../hierarchy/use-cases/create-node.use-case";
import { ValidateEmailUniquenessUseCase } from "../../hierarchy/use-cases/validate-email-uniqueness.use-case";
import { CreateUserDto } from "../models/dtos/create.dto";
import { ListUserDto } from "../models/dtos/list.dto";

@Injectable()
export class CreateUserUseCase {
	constructor(
		private readonly logger: Logger,
		private readonly validateEmailUniquenessUseCase: ValidateEmailUniquenessUseCase,
		private readonly createNodeUseCase: CreateNodeUseCase,
		private readonly dataSource: DataSource,
		private readonly createClosureSelfLinkUseCase: CreateClosureSelfLinkUseCase
	) {}

	async execute(dto: CreateUserDto): Promise<ListUserDto> {
		this.logger.log("Starting user creation", { email: dto.email, name: dto.name });
		try {
			await this.validateEmailUniquenessUseCase.execute(dto.email);
			const user = await this.dataSource.transaction(async entityManager => {
				const user = await this.createNodeUseCase.execute(NodeType.USER, dto.name, dto.email, entityManager);
				await this.createClosureSelfLinkUseCase.execute(user.id, entityManager);
				return user;
			});

			this.logger.log("User created successfully", { userId: user.id, email: dto.email });
			return new ListUserDto(user.id, user.type, user.name, user.email, user.createdAt);
		} catch (error) {
			this.logger.error("Failed to create user", error as Error, { email: dto.email });
			throw error;
		}
	}
}
