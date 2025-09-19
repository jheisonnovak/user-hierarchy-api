import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ListHierarchyDto } from "../../models/dtos/list.dto";
import { HierarchyNode } from "../../models/interfaces/hierarchy.interface";
import { FindAndValidateNodeUseCase } from "../find-and-validate-node/find-and-validate-node.use-case";
import { FindAncestorsUseCase } from "./find-ancestors.use-case";

describe("FindAncestors", () => {
	let findAncestorsUseCase: FindAncestorsUseCase;
	const mockAncestorsList: HierarchyNode[] = [{ id: "ancestor-1", name: "Root", depth: 0 }];
	const mockRepository = {
		findAncestorsById: jest.fn().mockResolvedValue(mockAncestorsList),
	};
	const mockFindAndValidateNodeUseCase = {
		execute: jest.fn().mockResolvedValue(undefined),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindAncestorsUseCase,
				{ provide: "INodeRepository", useValue: mockRepository },
				{ provide: FindAndValidateNodeUseCase, useValue: mockFindAndValidateNodeUseCase },
			],
		}).compile();

		findAncestorsUseCase = module.get<FindAncestorsUseCase>(FindAncestorsUseCase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(findAncestorsUseCase).toBeDefined();
		expect(mockRepository).toBeDefined();
	});

	describe("execute", () => {
		it("should find ancestors of a node", async () => {
			const result = await findAncestorsUseCase.execute("some-id");

			expect(mockRepository.findAncestorsById).toHaveBeenCalledWith("some-id");
			expect(mockRepository.findAncestorsById).toHaveBeenCalledTimes(1);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledWith("some-id");
			expect(result).toBeInstanceOf(Array<ListHierarchyDto>);
			expect(result).toEqual([{ id: "ancestor-1", name: "Root", depth: 0 }]);
		});

		it("should return empty array if node has no ancestors", async () => {
			jest.spyOn(mockRepository, "findAncestorsById").mockResolvedValueOnce([]);
			const result = await findAncestorsUseCase.execute("some-id");
			expect(result).toEqual([]);
		});

		it("should throw not found exception if node does not exist", async () => {
			jest.spyOn(mockFindAndValidateNodeUseCase, "execute").mockRejectedValueOnce(new NotFoundException());

			await expect(findAncestorsUseCase.execute("some-id")).rejects.toThrow(NotFoundException);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockRepository.findAncestorsById).toHaveBeenCalledTimes(0);
		});

		it("should throw error if repository fails", async () => {
			jest.spyOn(mockRepository, "findAncestorsById").mockRejectedValueOnce(new Error());

			await expect(findAncestorsUseCase.execute("some-id")).rejects.toThrow(Error);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockRepository.findAncestorsById).toHaveBeenCalledTimes(1);
		});
	});
});
