const request = require("supertest");
const { app, server } = require("../../src/index");

/**
 * Feature Test: Count API
 *
 * 1. Initially, the count should be 0.
 * 2. Incrementing the count should increase its value by 1.
 * 3. Retrieving the count should reflect the last updated value.
 * 4. Resetting the count should return it to 0.
 * 5. Setting the count with an invalid value should return a 400 error.
 * 6. Setting the count with a valid number should update it correctly.
 * 7. Further increments should continue from the last valid count.
 */

beforeAll(() => {
	jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
	server.close();
	console.log.mockRestore();
});

describe("Feature Test: Count API", () => {
	let agent;

	beforeAll(() => {
		agent = request.agent(app);
	});

	it("should get the initial count (0)", async () => {
		const response = await agent.get("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(0);
	});

	it("should increment the count (1)", async () => {
		const response = await agent.post("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(1);
	});

	it("should get the count (1)", async () => {
		const response = await agent.get("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(1);
	});

	it("should reset the count (0)", async () => {
		const response = await agent.delete("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(0);
	});

	it("should get the count (0) after reset", async () => {
		const response = await agent.get("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(0);
	});

	it("should not allow setting the count to a non-number", async () => {
		const response = await agent
			.put("/api/v1/count")
			.send({ value: "Dep trai" });
		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Value must be a number");
	});

	it("should not allow setting the count to an empty value", async () => {
		const response = await agent.put("/api/v1/count").send({});
		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Value must be a number");
	});

	it("should set the count to 5", async () => {
		const response = await agent.put("/api/v1/count").send({ value: 5 });
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(5);
	});

	it("should get the count (5)", async () => {
		const response = await agent.get("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(5);
	});

	it("should increment the count (6)", async () => {
		const response = await agent.post("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(6);
	});

	it("should get the count (6)", async () => {
		const response = await agent.get("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(6);
	});

	it("should increment the count multiple times", async () => {
		await agent.post("/api/v1/count"); // 7
		await agent.post("/api/v1/count"); // 8
		await agent.post("/api/v1/count"); // 9
		const response = await agent.get("/api/v1/count");

		expect(response.status).toBe(200);
		expect(response.body.count).toBe(9);
	});

	it("should reset after multiple increments", async () => {
		const response = await agent.delete("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(0);
	});

	it("should allow setting the count to 100", async () => {
		const response = await agent.put("/api/v1/count").send({ value: 100 });
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(100);
	});

	it("should get the count (100)", async () => {
		const response = await agent.get("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(100);
	});

	it("should reset again and verify", async () => {
		await agent.delete("/api/v1/count");
		const response = await agent.get("/api/v1/count");
		expect(response.status).toBe(200);
		expect(response.body.count).toBe(0);
	});
});
