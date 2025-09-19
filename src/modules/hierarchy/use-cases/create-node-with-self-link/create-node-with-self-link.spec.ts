import { Test, TestingModule } from "@nestjs/testing";
import { NodeType } from "../../models/enums/node-type.enum";
import { CreateNodeWithSelfLinkUseCase } from "./create-node-with-self-link.use-case";

describe("CreateNodeWithSelfLink", () => {
	let createNodeWithSelfLinkUseCase: CreateNodeWithSelfLinkUseCase;

	const mockRepository = {
		createWithSelfLink: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CreateNodeWithSelfLinkUseCase, { provide: "INodeRepository", useValue: mockRepository }],
		}).compile();

		createNodeWithSelfLinkUseCase = module.get<CreateNodeWithSelfLinkUseCase>(CreateNodeWithSelfLinkUseCase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(createNodeWithSelfLinkUseCase).toBeDefined();
		expect(mockRepository).toBeDefined();
	});

	describe("execute", () => {
		it("should create a node type USER with self link", async () => {
			const mockNode = { id: "node-123", type: NodeType.USER, name: "Test name", email: "test@mail.com" };
			jest.spyOn(mockRepository, "createWithSelfLink").mockResolvedValueOnce(mockNode);

			const result = await createNodeWithSelfLinkUseCase.execute(NodeType.USER, "Test name", "test@mail.com");

			expect(result).toEqual(mockNode);
			expect(result).toHaveProperty("email");
			expect(mockRepository.createWithSelfLink).toHaveBeenCalledTimes(1);
		});

		it("should create a node type GROUP with self link", async () => {
			const mockNode = { id: "node-123", type: NodeType.GROUP, name: "Test name" };
			jest.spyOn(mockRepository, "createWithSelfLink").mockResolvedValueOnce(mockNode);

			const result = await createNodeWithSelfLinkUseCase.execute(NodeType.GROUP, "Test name", "test@mail.com");

			expect(result).toEqual(mockNode);
			expect(result).not.toHaveProperty("email");
			expect(mockRepository.createWithSelfLink).toHaveBeenCalledTimes(1);
		});

		it("should throw an error when repository fails", async () => {
			jest.spyOn(mockRepository, "createWithSelfLink").mockRejectedValueOnce(new Error());

			await expect(createNodeWithSelfLinkUseCase.execute(NodeType.USER, "Test name", "test@mail.com")).rejects.toThrow(Error);
		});
	});
});
