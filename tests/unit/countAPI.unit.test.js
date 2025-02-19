const request = require('supertest');
const { app, server } = require('../../src/index');

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

afterAll(() => {
    server.close();
    console.log.mockRestore();
});

/**
 * Unit Test: Count API
 * 
 * 1. Initially, the count should be retrieved and is a valid number.
 * 2. Incrementing the count should increase its value by 1.
 * 3. Setting the count to a valid number should update it correctly.
 * 4. Setting the count with an invalid value should return a 400 error.
 * 5. Setting the count to zero should reset it to 0.
 * 6. Setting the count to a negative number should be allowed.
 * 7. Setting the count to a large number should update it correctly.
 * 8. Resetting the count should return it to 0.
 * 9. Concurrent increment requests should correctly update the count.
 * 10. Concurrent set and increment requests should work as expected.
 */

describe('Count Controller', () => {

    it('should get the current count', async () => {
        const response = await request(app).get('/api/v1/count');
        expect(response.status).toBe(200);
        expect(response.body.count).toBeDefined();
        expect(typeof response.body.count).toBe('number');
    });

    it('should increment the count', async () => {
        const initialResponse = await request(app).get('/api/v1/count');
        const initialCount = initialResponse.body.count;

        const response = await request(app).post('/api/v1/count');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Count incremented');
        expect(response.body.count).toBe(initialCount + 1);
    });

    it('should set the count to a valid number', async () => {
        const newValue = 100;
        const response = await request(app).put('/api/v1/count').send({ value: newValue });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Count set');
        expect(response.body.count).toBe(newValue);
    });

    it('should return an error if value is not a number', async () => {
        const response = await request(app).put('/api/v1/count').send({ value: 'not-a-number' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Value must be a number');
    });

    it('should return an error if value is null', async () => {
        const response = await request(app).put('/api/v1/count').send({ value: null });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Value must be a number');
    });

    it('should allow setting the count to zero', async () => {
        const response = await request(app).put('/api/v1/count').send({ value: 0 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Count set');
        expect(response.body.count).toBe(0);
    });

    it('should allow setting the count to a negative number', async () => {
        const response = await request(app).put('/api/v1/count').send({ value: -5 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Count set');
        expect(response.body.count).toBe(-5);
    });

    it('should allow setting the count to a large number', async () => {
        const largeNumber = 999999999;
        const response = await request(app).put('/api/v1/count').send({ value: largeNumber });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Count set');
        expect(response.body.count).toBe(largeNumber);
    });

    it('should reset the count to 0', async () => {
        const response = await request(app).delete('/api/v1/count');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Count reset to 0');
        expect(response.body.count).toBe(0);
    });

    it('should handle multiple increment requests concurrently', async () => {
        const initialResponse = await request(app).get('/api/v1/count');
        const initialCount = initialResponse.body.count;

        const promises = Array.from({ length: 5 }, () => request(app).post('/api/v1/count'));
        await Promise.all(promises);

        const finalResponse = await request(app).get('/api/v1/count');
        expect(finalResponse.body.count).toBe(initialCount + 5);
    });

    it('should handle concurrent set and increment requests correctly', async () => {
        const setValue = 50;
        await request(app).put('/api/v1/count').send({ value: setValue });

        const promises = Array.from({ length: 3 }, () => request(app).post('/api/v1/count'));
        await Promise.all(promises);

        const finalResponse = await request(app).get('/api/v1/count');
        expect(finalResponse.body.count).toBe(setValue + 3);
    });

});
