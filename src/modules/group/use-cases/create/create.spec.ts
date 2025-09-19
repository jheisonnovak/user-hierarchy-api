import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { DataSource } from "typeorm";
import { NodeType } from "../../../hierarchy/models/enums/node-type.enum";
import { CreateNodeWithSelfLinkUseCase } from "../../../hierarchy/use-cases/create-node.use-case";
import { CreateRelationshipUseCase } from "../../../hierarchy/use-cases/create-relationship.use-case";
import { FindAndValidateNodeUseCase } from "../../../hierarchy/use-cases/find-and-validate-node.use-case";
import { ListGroupDto } from "../../models/dtos/list.dto";
import { CreateGroupUseCase } from "./create.use-case";

describe("CreateGroup", () => {
	let createUseCase: CreateGroupUseCase;
	const mockGroup = {
		id: "group-123",
		type: NodeType.GROUP,
		name: "Test name",
		createdAt: new Date("2025-09-18T10:00:00Z"),
	};
	const mockParent = {
		id: "parent-123",
		type: NodeType.GROUP,
		name: "Parent Group",
		createdAt: new Date("2025-09-18T10:00:00Z"),
	};
	const createGroupDto = { name: "Test name", parentId: "parent-123" };
	const mockDataSource = {
		transaction: jest.fn().mockImplementation(async callback => {
			return callback({});
		}),
	};
	const mockCreateRelationshipUseCase = {
		execute: jest.fn().mockResolvedValue(undefined),
	};

	const mockCreateNodeWithSelfLinkUseCase = {
		execute: jest.fn().mockResolvedValue(mockGroup),
	};
	const mockFindAndValidateNodeUseCase = {
		execute: jest.fn().mockResolvedValue(mockParent),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [LoggerModule.forRoot({ pinoHttp: { autoLogging: false } })],
			providers: [
				CreateGroupUseCase,
				{ provide: "INodeRepository", useValue: {} },
				{ provide: CreateRelationshipUseCase, useValue: mockCreateRelationshipUseCase },
				{ provide: CreateNodeWithSelfLinkUseCase, useValue: mockCreateNodeWithSelfLinkUseCase },
				{ provide: FindAndValidateNodeUseCase, useValue: mockFindAndValidateNodeUseCase },
				{ provide: DataSource, useValue: mockDataSource },
			],
		}).compile();

		createUseCase = module.get<CreateGroupUseCase>(CreateGroupUseCase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(createUseCase).toBeDefined();
		expect(mockCreateRelationshipUseCase).toBeDefined();
		expect(mockCreateNodeWithSelfLinkUseCase).toBeDefined();
	});

	describe("CreateGroupUseCase", () => {
		it("should create a group without parent", async () => {
			const result = await createUseCase.execute({ name: createGroupDto.name });

			expect(result).toBeInstanceOf(ListGroupDto);
			expect(result["id"]).toEqual(mockGroup.id);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledWith(NodeType.GROUP, mockGroup.name, undefined, {});
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(0);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(0);
		});

		it("should create a group with parent", async () => {
			const result = await createUseCase.execute(createGroupDto);

			expect(result).toBeInstanceOf(ListGroupDto);
			expect(result["id"]).toEqual(mockGroup.id);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledWith(NodeType.GROUP, mockGroup.name, undefined, {});
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledWith("parent-123", NodeType.GROUP, {});
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledWith(mockParent, mockGroup, {});
		});

		it("should throw error when creating group fails", async () => {
			jest.spyOn(mockCreateNodeWithSelfLinkUseCase, "execute").mockRejectedValueOnce(new Error());

			await expect(createUseCase.execute(createGroupDto)).rejects.toThrow(Error);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(0);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(0);
		});

		it("should throw not found exception when finding parent group fails", async () => {
			jest.spyOn(mockFindAndValidateNodeUseCase, "execute").mockRejectedValueOnce(new Error());

			await expect(createUseCase.execute(createGroupDto)).rejects.toThrow(Error);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(0);
		});

		it("should throw conflict exception when create relationship fails", async () => {
			jest.spyOn(mockCreateRelationshipUseCase, "execute").mockRejectedValueOnce(new ConflictException());

			await expect(createUseCase.execute(createGroupDto)).rejects.toThrow(ConflictException);
			expect(mockCreateNodeWithSelfLinkUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(1);
		});
	});
});
