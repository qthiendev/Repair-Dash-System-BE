const request = require('supertest');
const { app, server } = require('../../src/index');
let transaction;

beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(async () => {
    server.close();
    console.log.mockRestore();
});


describe('Feature Test: User API', () => {
    let agent;
    let createdUserId;

    beforeAll(() => {
        agent = request.agent(app);
    });

    it('should read all users', async () => {
        const response = await agent.get('/api/v1/user');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should fail to read a non-existent user', async () => {
        const response = await agent.get('/api/v1/user/999999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should create a new user', async () => {
        const userData = {
            identifier_email: "testuser@example.com",
            password: "password123",
            role: "CUSTOMER",
            user_full_name: "Test User",
            user_phone_number: "0123456789",
            user_address: "123 Test Street"
        };

        const response = await agent.post('/api/v1/user').send(userData);
        expect(response.status).toBe(201);
        expect(response.body.user_id).toBeDefined();

        createdUserId = response.body.user_id;
    });

    it('should read the newly created user', async () => {
        const response = await agent.get(`/api/v1/user/${createdUserId}`);
        expect(response.status).toBe(200);
        expect(response.body.data.user_id).toBe(createdUserId);
    });

    it('should fail to create a user with invalid data', async () => {
        const response = await agent.post('/api/v1/user').send({
            identifier_email: "not-an-email",
            password: "123",
            role: "UNKNOWN",
            user_full_name: "A",
            user_phone_number: "123",
            user_address: ""
        });

        expect(response.status).toBe(400);
    });

    it('should update the newly created user', async () => {
        const response = await agent.put(`/api/v1/user/${createdUserId}`).send({
            user_full_name: "Updated User",
            user_phone_number: "0987654321",
            user_address: "Updated Address"
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
    });

    it('should fail to update user with invalid data', async () => {
        const response = await agent.put(`/api/v1/user/${createdUserId}`).send({
            user_full_name: "",
            user_phone_number: "1",
            user_address: ""
        });

        expect(response.status).toBe(400);
    });

    it('should delete the newly created user', async () => {
        const response = await agent.delete(`/api/v1/user/${createdUserId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });

    it('should fail to read the deleted user', async () => {
        const response = await agent.get(`/api/v1/user/${createdUserId}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should fail to delete the same user again', async () => {
        const response = await agent.delete(`/api/v1/user/${createdUserId}`);
        expect(response.status).toBe(404);
    });
});
