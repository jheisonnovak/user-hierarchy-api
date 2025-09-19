import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { NodeType } from "../../../hierarchy/models/enums/node-type.enum";
import { CreateNodeWithSelfLinkUseCase } from "../../../hierarchy/use-cases/create-node.use-case";
import { ValidateEmailUniquenessUseCase } from "../../../hierarchy/use-cases/validate-email-uniqueness.use-case";
import { ListUserDto } from "../../models/dtos/list.dto";
import { CreateUserUseCase } from "./create.use-case";

describe("CreateUser", () => {
	let createUseCase: CreateUserUseCase;
	const mockUserNode = {
		id: "user-123",
		type: NodeType.USER,
		name: "Test name",
		email: "test@mail.com",
		createdAt: new Date("2025-09-18T10:00:00Z"),
	};
	const createUserDto = { name: "Test name", email: "existing@mail.com" };

	const mockValidateEmailUniquenessUseCase = {
		execute: jest.fn().mockResolvedValue(undefined),
	};

	const mockCreateNodeWithSelfLinkUseCase = {
		execute: jest.fn().mockResolvedValue(mockUserNode),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [LoggerModule.forRoot({ pinoHttp: { autoLogging: false } })],
			providers: [
				CreateUserUseCase,
				{ provide: "INodeRepository", useValue: {} },
				{ provide: ValidateEmailUniquenessUseCase, useValue: mockValidateEmailUniquenessUseCase },
				{ provide: CreateNodeWithSelfLinkUseCase, useValue: mockCreateNodeWithSelfLinkUseCase },
			],
		}).compile();

		createUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(createUseCase).toBeDefined();
		expect(mockValidateEmailUniquenessUseCase).toBeDefined();
		expect(mockCreateNodeWithSelfLinkUseCase).toBeDefined();
	});

	describe("CreateUserUseCase", () => {
		it("should create an user", async () => {
			const result = await createUseCase.execute(createUserDto);

			expect(result).toBeInstanceOf(ListUserDto);
			expect(result["id"]).toEqual(mockUserNode.id);
			expect(mockValidateEmailUniquenessUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledTimes(1);
		});

		it("should throw error when email already exists", async () => {
			jest.spyOn(mockValidateEmailUniquenessUseCase, "execute").mockRejectedValueOnce(new ConflictException());

			await expect(createUseCase.execute(createUserDto)).rejects.toThrow(ConflictException);
			expect(mockValidateEmailUniquenessUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledTimes(0);
		});

		it("should throw error when node creation fails", async () => {
			jest.spyOn(mockCreateNodeWithSelfLinkUseCase, "execute").mockRejectedValueOnce(new Error());

			await expect(createUseCase.execute(createUserDto)).rejects.toThrow(Error);
			expect(mockValidateEmailUniquenessUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledTimes(1);
		});
	});
});
