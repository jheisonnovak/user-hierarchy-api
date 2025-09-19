import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ListHierarchyDto } from "../../models/dtos/list.dto";
import { HierarchyNode } from "../../models/interfaces/hierarchy.interface";
import { FindAndValidateNodeUseCase } from "../find-and-validate-node/find-and-validate-node.use-case";
import { FindDescendantsUseCase } from "./find-descendants.use-case";
describe("FindDescendants", () => {
	let findDescendantsUseCase: FindDescendantsUseCase;
	const mockDescendantsList: HierarchyNode[] = [{ id: "descendant-1", name: "Child", depth: 1 }];
	const mockRepository = {
		findDescendantsById: jest.fn().mockResolvedValue(mockDescendantsList),
	};
	const mockFindAndValidateNodeUseCase = {
		execute: jest.fn().mockResolvedValue(undefined),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindDescendantsUseCase,
				{ provide: "INodeRepository", useValue: mockRepository },
				{ provide: FindAndValidateNodeUseCase, useValue: mockFindAndValidateNodeUseCase },
			],
		}).compile();

		findDescendantsUseCase = module.get<FindDescendantsUseCase>(FindDescendantsUseCase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(findDescendantsUseCase).toBeDefined();
		expect(mockRepository).toBeDefined();
	});

	describe("execute", () => {
		it("should find descendants of a node", async () => {
			const result = await findDescendantsUseCase.execute("some-id");

			expect(mockRepository.findDescendantsById).toHaveBeenCalledWith("some-id");
			expect(mockRepository.findDescendantsById).toHaveBeenCalledTimes(1);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledWith("some-id");
			expect(result).toBeInstanceOf(Array<ListHierarchyDto>);
			expect(result).toEqual([{ id: "descendant-1", name: "Child", depth: 1 }]);
		});

		it("should return empty array if node has no descendants", async () => {
			jest.spyOn(mockRepository, "findDescendantsById").mockResolvedValueOnce([]);
			const result = await findDescendantsUseCase.execute("some-id");
			expect(result).toEqual([]);
		});

		it("should throw not found exception if node does not exist", async () => {
			jest.spyOn(mockFindAndValidateNodeUseCase, "execute").mockRejectedValueOnce(new NotFoundException());

			await expect(findDescendantsUseCase.execute("some-id")).rejects.toThrow(NotFoundException);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockRepository.findDescendantsById).toHaveBeenCalledTimes(0);
		});

		it("should throw error if repository fails", async () => {
			jest.spyOn(mockRepository, "findDescendantsById").mockRejectedValueOnce(new Error());

			await expect(findDescendantsUseCase.execute("some-id")).rejects.toThrow(Error);
			expect(mockFindAndValidateNodeUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockRepository.findDescendantsById).toHaveBeenCalledTimes(1);
		});
	});
});
