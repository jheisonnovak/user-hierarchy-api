import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { INodeRepository } from "../../models/interfaces/node.repository.interface";
import { ValidateEmailUniquenessUseCase } from "./validate-email-uniqueness.use-case";

describe("ValidateEmailUniqueness", () => {
	let validateEmailUniquenessUseCase: ValidateEmailUniquenessUseCase;
	let nodeRepository: INodeRepository;

	const mockRepository = {
		existsByEmail: jest.fn().mockResolvedValue(undefined),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ValidateEmailUniquenessUseCase, { provide: "INodeRepository", useValue: mockRepository }],
		}).compile();

		validateEmailUniquenessUseCase = module.get<ValidateEmailUniquenessUseCase>(ValidateEmailUniquenessUseCase);
		nodeRepository = module.get<INodeRepository>("INodeRepository");
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(validateEmailUniquenessUseCase).toBeDefined();
		expect(nodeRepository).toBeDefined();
	});

	describe("execute", () => {
		it("should create a relationship between parent and child nodes", async () => {
			const result = await validateEmailUniquenessUseCase.execute("test@mail.com");

			expect(result).toBeUndefined();
			expect(nodeRepository.existsByEmail).toHaveBeenCalledTimes(1);
			expect(nodeRepository.existsByEmail).toHaveBeenCalledWith("test@mail.com");
		});

		it("should throw conflict exception when email already exists", async () => {
			jest.spyOn(nodeRepository, "existsByEmail").mockResolvedValue(true);

			await expect(validateEmailUniquenessUseCase.execute("test@mail.com")).rejects.toThrow(ConflictException);
		});

		it("should throw internal server error when repository fails", async () => {
			jest.spyOn(nodeRepository, "existsByEmail").mockRejectedValueOnce(new Error());

			await expect(validateEmailUniquenessUseCase.execute("test@mail.com")).rejects.toThrow(Error);
		});
	});
});
