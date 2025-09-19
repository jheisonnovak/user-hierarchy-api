import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ClosureEntity } from "../../models/entities/closure.entity";
import { NodeEntity } from "../../models/entities/node.entity";
import { IClosureRepository } from "../../models/interfaces/closure.repository.interface";
import { CreateRelationshipUseCase } from "./create-relationship.use-case";

describe("CreateRelationship", () => {
	let createRelationshipUseCase: CreateRelationshipUseCase;
	let closureRepository: IClosureRepository;

	const mockParent = new NodeEntity({ id: "parent-id" });
	const mockChild = new NodeEntity({ id: "child-id" });
	const mockClosure = new ClosureEntity({ ancestorId: "ancestor-id", descendantId: "descendant-id", depth: 1 });
	const mockRepository = {
		createRelationshipsBatch: jest.fn().mockResolvedValue(undefined),
		findRelationBetweenNodes: jest.fn().mockResolvedValue(mockClosure),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CreateRelationshipUseCase, { provide: "IClosureRepository", useValue: mockRepository }],
		}).compile();

		createRelationshipUseCase = module.get<CreateRelationshipUseCase>(CreateRelationshipUseCase);
		closureRepository = module.get<IClosureRepository>("IClosureRepository");
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(createRelationshipUseCase).toBeDefined();
		expect(closureRepository).toBeDefined();
	});

	describe("execute", () => {
		it("should create a relationship between parent and child nodes", async () => {
			const result = await createRelationshipUseCase.execute(mockParent, mockChild);

			expect(result).toBeUndefined();
			expect(closureRepository.findRelationBetweenNodes).toHaveBeenCalledTimes(1);
			expect(closureRepository.findRelationBetweenNodes).toHaveBeenCalledWith(mockParent.id, mockChild.id, undefined);
			expect(closureRepository.createRelationshipsBatch).toHaveBeenCalledTimes(1);
			expect(closureRepository.createRelationshipsBatch).toHaveBeenCalledWith(mockParent.id, mockChild.id, undefined);
		});

		it("should throw conflict exception when parent and child are same", () => {
			expect(createRelationshipUseCase.execute(mockParent, mockParent)).rejects.toThrow(ConflictException);

			expect(closureRepository.findRelationBetweenNodes).toHaveBeenCalledTimes(0);
			expect(closureRepository.createRelationshipsBatch).toHaveBeenCalledTimes(0);
		});

		it("should throw error when finding relationship fails", () => {
			jest.spyOn(closureRepository, "findRelationBetweenNodes").mockRejectedValueOnce(new Error());

			expect(createRelationshipUseCase.execute(mockParent, mockChild)).rejects.toThrow(Error);

			expect(closureRepository.findRelationBetweenNodes).toHaveBeenCalledTimes(1);
			expect(closureRepository.createRelationshipsBatch).toHaveBeenCalledTimes(0);
		});

		it("should throw conflict exception when cyclic relationship detected", () => {
			const mockExistingCycle = new ClosureEntity({ ancestorId: mockChild.id, descendantId: mockParent.id });
			jest.spyOn(closureRepository, "findRelationBetweenNodes").mockResolvedValueOnce(mockExistingCycle);

			expect(createRelationshipUseCase.execute(mockParent, mockChild)).rejects.toThrow(ConflictException);

			expect(closureRepository.findRelationBetweenNodes).toHaveBeenCalledTimes(1);
			expect(closureRepository.createRelationshipsBatch).toHaveBeenCalledTimes(0);
		});

		it("should throw conflict exception when cycle exists", () => {
			const mockExistingCycle = new ClosureEntity({ ancestorId: mockParent.id, descendantId: mockChild.id });
			jest.spyOn(closureRepository, "findRelationBetweenNodes").mockResolvedValueOnce(mockExistingCycle);

			expect(createRelationshipUseCase.execute(mockParent, mockChild)).rejects.toThrow(ConflictException);

			expect(closureRepository.findRelationBetweenNodes).toHaveBeenCalledTimes(1);
			expect(closureRepository.createRelationshipsBatch).toHaveBeenCalledTimes(0);
		});

		it("should throw error when creating relationship fails", async () => {
			jest.spyOn(closureRepository, "createRelationshipsBatch").mockRejectedValueOnce(new Error());

			await expect(createRelationshipUseCase.execute(mockParent, mockChild)).rejects.toThrow(Error);

			expect(closureRepository.findRelationBetweenNodes).toHaveBeenCalledTimes(1);
			expect(closureRepository.createRelationshipsBatch).toHaveBeenCalledTimes(1);
		});
	});
});
