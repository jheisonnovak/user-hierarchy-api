import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { ListHierarchyDto } from "../../../hierarchy/models/dtos/list.dto";
import { NodeType } from "../../../hierarchy/models/enums/node-type.enum";
import { FindAndValidateNodeUseCase } from "../../../hierarchy/use-cases/find-and-validate-node.use-case";
import { FindOrganizationsUseCase } from "./find-organizations.use-case";

describe("FindOrganizationsUser", () => {
	let createAssociationUseCase: FindOrganizationsUseCase;
	const mockGroupList = [
		{
			id: "group-123",
			name: "Test Group",
			depth: 1,
		},
	];
	const mockFindAndValidateNodeUseCase = {
		execute: jest.fn(),
	};
	const mockRepository = {
		findAncestorsByIdAndType: jest.fn().mockResolvedValue(mockGroupList),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [LoggerModule.forRoot({ pinoHttp: { autoLogging: false } })],
			providers: [
				FindOrganizationsUseCase,
				{ provide: "INodeRepository", useValue: mockRepository },
				{ provide: FindAndValidateNodeUseCase, useValue: mockFindAndValidateNodeUseCase },
			],
		}).compile();

		createAssociationUseCase = module.get<FindOrganizationsUseCase>(FindOrganizationsUseCase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(createAssociationUseCase).toBeDefined();
		expect(mockFindAndValidateNodeUseCase).toBeDefined();
	});

	describe("FindOrganizationsUserUseCase", () => {
		it("should return a list of organizations", async () => {
			const result = await createAssociationUseCase.execute("user-123");

			expect(result).toBeInstanceOf(Array<ListHierarchyDto>);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledWith("user-123", NodeType.USER);
			expect(mockRepository.findAncestorsByIdAndType).toHaveBeenCalledTimes(1);
			expect(mockRepository.findAncestorsByIdAndType).toHaveBeenCalledWith("user-123", NodeType.GROUP);
		});

		it("should return empty array when user has no groups", async () => {
			jest.spyOn(mockRepository, "findAncestorsByIdAndType").mockResolvedValueOnce([]);

			const result = await createAssociationUseCase.execute("user-123");

			expect(result).toEqual([]);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockRepository.findAncestorsByIdAndType).toHaveBeenCalledTimes(1);
		});

		it("should throw not found exception when user not found", async () => {
			jest.spyOn(mockFindAndValidateNodeUseCase, "execute").mockRejectedValueOnce(new NotFoundException());

			await expect(createAssociationUseCase.execute("user-123")).rejects.toThrow(NotFoundException);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockRepository.findAncestorsByIdAndType).toHaveBeenCalledTimes(0);
		});
	});
});
