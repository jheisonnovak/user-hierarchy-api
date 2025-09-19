import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { NodeEntity } from "../../models/entities/node.entity";
import { NodeType } from "../../models/enums/node-type.enum";
import { FindAndValidateNodeUseCase } from "../find-and-validate-node/find-and-validate-node.use-case";

describe("FindAndValidateNode", () => {
	let findAndValidateNodeUseCase: FindAndValidateNodeUseCase;
	const mockNode = new NodeEntity({ id: "some-id", name: "Some Node" });
	const mockRepository = {
		findByIdAndType: jest.fn().mockResolvedValue(mockNode),
		findById: jest.fn().mockResolvedValue(mockNode),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [FindAndValidateNodeUseCase, { provide: "INodeRepository", useValue: mockRepository }],
		}).compile();

		findAndValidateNodeUseCase = module.get<FindAndValidateNodeUseCase>(FindAndValidateNodeUseCase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(findAndValidateNodeUseCase).toBeDefined();
		expect(mockRepository).toBeDefined();
	});

	describe("execute", () => {
		it("should find and validate a node by id and type", async () => {
			const result = await findAndValidateNodeUseCase.execute("some-id", NodeType.USER);

			expect(result).toBeInstanceOf(NodeEntity);
			expect(result).toEqual(mockNode);
			expect(mockRepository.findByIdAndType).toHaveBeenCalledWith("some-id", NodeType.USER, undefined);
			expect(mockRepository.findByIdAndType).toHaveBeenCalledTimes(1);
			expect(mockRepository.findById).toHaveBeenCalledTimes(0);
		});

		it("should find and validate a node by id", async () => {
			const result = await findAndValidateNodeUseCase.execute("some-id");

			expect(result).toBeInstanceOf(NodeEntity);
			expect(result).toEqual(mockNode);
			expect(mockRepository.findById).toHaveBeenCalledWith("some-id", undefined);
			expect(mockRepository.findById).toHaveBeenCalledTimes(1);
			expect(mockRepository.findByIdAndType).toHaveBeenCalledTimes(0);
		});

		it("should throw error when repository fails", async () => {
			jest.spyOn(mockRepository, "findByIdAndType").mockRejectedValueOnce(new Error());

			await expect(findAndValidateNodeUseCase.execute("some-id", NodeType.USER)).rejects.toThrow(Error);
		});

		it("should throw not found exception when node does not exist", async () => {
			jest.spyOn(mockRepository, "findByIdAndType").mockResolvedValueOnce(null);

			await expect(findAndValidateNodeUseCase.execute("some-id", NodeType.USER)).rejects.toThrow(NotFoundException);
		});
	});
});
