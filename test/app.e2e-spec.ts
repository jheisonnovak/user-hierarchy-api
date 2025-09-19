import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { PinoLogger } from "nestjs-pino";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

interface UserResponse {
	id: string;
	type: string;
	name: string;
	email?: string | null;
	createdAt: string;
}

interface GroupResponse {
	id: string;
	type: string;
	name: string;
	createdAt: string;
}

interface OrganizationItem {
	id: string;
	name: string;
	depth: number;
}

describe("App (e2e)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const mockPino = { info: (): void => {}, error: (): void => {} };
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(PinoLogger)
			.useValue(mockPino)
			.compile();

		app = moduleFixture.createNestApplication({ logger: false });
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	const createUser = (): { name: string; email: string } => ({
		name: `User ${randomUUID()}`,
		email: `${randomUUID()}@mail.com`,
	});

	const createGroup = (name?: string): { name: string } => ({ name: name ?? randomUUID() });

	it("Should perform end-to-end user and group hierarchy operations", async () => {
		// Create user, groups and associations
		const userResponse = await request(app.getHttpServer()).post("/users").send(createUser());
		expect(userResponse.status).toBe(201);
		const user = userResponse.body as UserResponse;
		const userId = user.id;

		const groupOneResponse = await request(app.getHttpServer()).post("/groups").send(createGroup("Group 1"));
		expect(groupOneResponse.status).toBe(201);
		const groupOne = groupOneResponse.body as GroupResponse;

		const groupTwoResponse = await request(app.getHttpServer()).post("/groups").send({ name: "Group 2", parentId: groupOne.id });
		expect(groupTwoResponse.status).toBe(201);
		const groupTwo = groupTwoResponse.body as GroupResponse;

		const groupThreeResponse = await request(app.getHttpServer()).post("/groups").send({ name: "Group 3", parentId: groupTwo.id });
		expect(groupThreeResponse.status).toBe(201);
		const groupThree = groupThreeResponse.body as GroupResponse;

		// Associate user with group 3 (which is a child of group 2 and group 1)
		const a1 = await request(app.getHttpServer()).post(`/users/${userId}/groups`).send({ groupId: groupThree.id });
		expect([204, 200]).toContain(a1.status);

		const organizationsResponse = await request(app.getHttpServer()).get(`/users/${userId}/organizations`);
		expect(organizationsResponse.status).toBe(200);
		const organizations = organizationsResponse.body as OrganizationItem[];

		const ids = organizations.map(o => o.id);
		const depths = organizations.map(o => o.depth);
		expect(ids).toEqual(expect.arrayContaining([groupThree.id, groupTwo.id, groupOne.id]));
		expect(depths).toEqual(depths.slice().sort((a, b) => a - b));
		expect(ids.length).toBe(new Set(ids).size);

		// Ancestors of group 3
		const ancestorsResponse = await request(app.getHttpServer()).get(`/nodes/${groupThree.id}/ancestors`);
		expect(ancestorsResponse.status).toBe(200);
		const ancestors = ancestorsResponse.body as OrganizationItem[];
		const ancestorsIds = ancestors.map(n => n.id);
		expect(ancestorsIds).toEqual(expect.arrayContaining([groupOne.id, groupTwo.id]));
		expect(ancestors.every(n => n.depth >= 1)).toBe(true);

		// Descendants of group 1
		const descendantsResponse = await request(app.getHttpServer()).get(`/nodes/${groupOne.id}/descendants`);
		expect(descendantsResponse.status).toBe(200);
		const descendants = descendantsResponse.body as OrganizationItem[];
		const descendantIds = new Set(descendants.map(n => n.id));
		expect(descendantIds.has(groupThree.id)).toBe(true);
		expect(descendantIds.has(groupTwo.id)).toBe(true);
	});

	it("Should handle multiple group memberships with correct minimum depths", async () => {
		const userResponse = await request(app.getHttpServer()).post("/users").send(createUser());
		expect(userResponse.status).toBe(201);
		const user = userResponse.body as UserResponse;

		const groupOne = (await request(app.getHttpServer()).post("/groups").send(createGroup("Group 1"))).body as GroupResponse;
		const groupTwo = (await request(app.getHttpServer()).post("/groups").send({ name: "Group 2", parentId: groupOne.id })).body as GroupResponse;
		const groupThree = (await request(app.getHttpServer()).post("/groups").send({ name: "Group 3", parentId: groupOne.id }))
			.body as GroupResponse;

		const associationOne = await request(app.getHttpServer()).post(`/users/${user.id}/groups`).send({ groupId: groupTwo.id });
		const associationTwo = await request(app.getHttpServer()).post(`/users/${user.id}/groups`).send({ groupId: groupThree.id });
		expect(associationOne.status).toBe(204);
		expect(associationTwo.status).toBe(204);

		const organizationResponse = await request(app.getHttpServer()).get(`/users/${user.id}/organizations`);
		expect(organizationResponse.status).toBe(200);
		const organizations = organizationResponse.body as OrganizationItem[];

		const depthsByOrganizationId: Record<string, number[]> = {};
		organizations.forEach(organization => {
			depthsByOrganizationId[organization.id] = depthsByOrganizationId[organization.id] || [];
			depthsByOrganizationId[organization.id].push(organization.depth);
		});

		expect(Math.min(...(depthsByOrganizationId[groupTwo.id] || [Infinity]))).toBe(1);
		expect(Math.min(...(depthsByOrganizationId[groupThree.id] || [Infinity]))).toBe(1);
	});

	it("Should prevent cycles in group hierarchy and duplicate user emails", async () => {
		const groupOne = (await request(app.getHttpServer()).post("/groups").send(createGroup("Group 1"))).body as GroupResponse;
		const groupTwo = (await request(app.getHttpServer()).post("/groups").send({ name: "Group 2", parentId: groupOne.id })).body as GroupResponse;

		const errorResponse = await request(app.getHttpServer()).post(`/users/${groupOne.id}/groups`).send({ groupId: groupTwo.id });
		expect(errorResponse.status).toBe(409);

		const email = `${randomUUID()}@mail.com`;
		const responseOne = await request(app.getHttpServer()).post("/users").send({ name: "User 1", email });
		const responseTwo = await request(app.getHttpServer()).post("/users").send({ name: "User 2", email });
		expect(responseOne.status).toBe(201);
		expect(responseTwo.status).toBe(409);
	});
});
