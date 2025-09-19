import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { NodeType } from "../../../hierarchy/models/enums/node-type.enum";
import { CreateRelationshipUseCase } from "../../../hierarchy/use-cases/create-relationship/create-relationship.use-case";
import { FindAndValidateNodeUseCase } from "../../../hierarchy/use-cases/find-and-validate-node/find-and-validate-node.use-case";
import { CreateAssociationUserUseCase } from "./create-association.use-case";

describe("CreateAssociationUser", () => {
	let createAssociationUseCase: CreateAssociationUserUseCase;
	const mockNode = {
		id: "user-123",
		type: NodeType.USER,
		name: "Test name",
		email: "test@mail.com",
		createdAt: new Date("2025-09-18T10:00:00Z"),
	};
	const mockGroup = {
		id: "group-123",
		type: NodeType.GROUP,
		name: "Test Group",
		createdAt: new Date("2025-09-18T10:00:00Z"),
	};
	const mockDataSource = {
		transaction: jest.fn().mockImplementation(async callback => {
			return callback({});
		}),
	};
	const createAssociationDto = { groupId: "group-123" };

	const mockFindAndValidateNodeUseCase = {
		execute: jest.fn(),
	};

	const mockCreateRelationshipUseCase = {
		execute: jest.fn().mockResolvedValue(undefined),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [],
			providers: [
				CreateAssociationUserUseCase,
				{ provide: "INodeRepository", useValue: {} },
				{ provide: FindAndValidateNodeUseCase, useValue: mockFindAndValidateNodeUseCase },
				{ provide: CreateRelationshipUseCase, useValue: mockCreateRelationshipUseCase },
				{ provide: DataSource, useValue: mockDataSource },
			],
		}).compile();

		createAssociationUseCase = module.get<CreateAssociationUserUseCase>(CreateAssociationUserUseCase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(createAssociationUseCase).toBeDefined();
		expect(mockFindAndValidateNodeUseCase).toBeDefined();
		expect(mockCreateRelationshipUseCase).toBeDefined();
	});

	describe("execute", () => {
		it("should create an association", async () => {
			mockFindAndValidateNodeUseCase.execute.mockResolvedValueOnce(mockGroup).mockResolvedValueOnce(mockNode);

			const result = await createAssociationUseCase.execute("user-123", createAssociationDto);

			expect(result).toBe(undefined);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(2);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenNthCalledWith(1, "group-123", NodeType.GROUP, {});
			expect(mockFindAndValidateNodeUseCase.execute).toHaveReturnedWith(Promise.resolve(mockGroup));
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenNthCalledWith(2, "user-123", undefined, {});
			expect(mockFindAndValidateNodeUseCase.execute).toHaveReturnedWith(Promise.resolve(mockNode));
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledWith(mockGroup, mockNode, {});
		});

		it("should throw not found exception when group not found", async () => {
			jest.spyOn(mockFindAndValidateNodeUseCase, "execute").mockRejectedValueOnce(new NotFoundException());

			await expect(createAssociationUseCase.execute("user-123", createAssociationDto)).rejects.toThrow(NotFoundException);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(0);
		});

		it("should throw not found exception when node not found", async () => {
			jest.spyOn(mockFindAndValidateNodeUseCase, "execute").mockResolvedValueOnce(mockGroup).mockRejectedValueOnce(new NotFoundException());

			await expect(createAssociationUseCase.execute("user-123", createAssociationDto)).rejects.toThrow(NotFoundException);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(2);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(0);
		});

		it("should throw conflict exception when creating relationship fails", async () => {
			jest.spyOn(mockFindAndValidateNodeUseCase, "execute").mockResolvedValueOnce(mockGroup).mockResolvedValueOnce(mockNode);
			jest.spyOn(mockCreateRelationshipUseCase, "execute").mockRejectedValueOnce(new ConflictException());

			await expect(createAssociationUseCase.execute("user-123", createAssociationDto)).rejects.toThrow(ConflictException);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(2);
			expect(mockCreateRelationshipUseCase.execute).toHaveBeenCalledTimes(1);
		});
	});
});
