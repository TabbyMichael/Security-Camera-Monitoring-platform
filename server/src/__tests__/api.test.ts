import request from 'supertest';
import app from '../index'; // Import the refactored Express app

describe('GET /api/test', () => {
  it('should respond with a success message', async () => {
    const response = await request(app).get('/api/test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Backend is running!' });
  });
});
