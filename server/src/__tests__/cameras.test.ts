import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Camera } from '../models/Camera';

describe('Camera Routes', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    // Register and log in a user to get a token
    const userCredentials = {
      name: 'cameratester',
      email: 'camera.test@example.com',
      password: 'password123',
    };

    await request(app).post('/api/auth/register').send(userCredentials);

    const response = await request(app).post('/api/auth/login').send(userCredentials);

    token = response.body.token;
    userId = response.body._id;
  });

  describe('POST /api/cameras', () => {
    const newCamera = {
      name: 'Front Door Cam',
      location: 'Entrance',
      streamUrl: 'rtsp://test.stream/1',
      type: 'outdoor',
    };

    it('should create a new camera with valid data and authentication', async () => {
      const response = await request(app)
        .post('/api/cameras')
        .set('Authorization', `Bearer ${token}`)
        .send(newCamera);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(newCamera);
      expect(response.body).toHaveProperty('_id');

      // Verify camera was saved to the DB
      const dbCamera = await Camera.findById(response.body._id);
      expect(dbCamera).not.toBeNull();
      expect(dbCamera?.name).toBe(newCamera.name);
    });

    it('should fail to create a camera without authentication', async () => {
      const response = await request(app)
        .post('/api/cameras')
        .send(newCamera);

      expect(response.statusCode).toBe(401);
    });

    it('should fail to create a camera with invalid data', async () => {
      const { name, ...invalidCamera } = newCamera; // Omitting required 'name' field
      const response = await request(app)
        .post('/api/cameras')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidCamera);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/cameras', () => {
    beforeEach(async () => {
      // Create a sample camera before each test
      await request(app)
        .post('/api/cameras')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Lobby Cam',
          location: 'Main Lobby',
          streamUrl: 'rtsp://test.stream/2',
          type: 'indoor',
        });
    });

    it('should fetch all cameras for an authenticated user', async () => {
      const response = await request(app)
        .get('/api/cameras')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toBe('Lobby Cam');
    });

    it('should fail to fetch cameras without authentication', async () => {
      const response = await request(app).get('/api/cameras');
      expect(response.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/cameras/:id/status', () => {
    let camera: any;

    beforeEach(async () => {
      // Create a sample camera before each test
      const response = await request(app)
        .post('/api/cameras')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Garage Cam',
          location: 'Garage',
          streamUrl: 'rtsp://test.stream/3',
          type: 'outdoor',
        });
      camera = response.body;
    });

    it('should update a camera status successfully', async () => {
      const newStatus = { status: 'online' };
      const response = await request(app)
        .patch(`/api/cameras/${camera._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send(newStatus);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('online');

      // Verify the change in the database
      const dbCamera = await Camera.findById(camera._id);
      expect(dbCamera?.status).toBe('online');
    });

    it('should return 404 for a non-existent camera ID', async () => {
      const newStatus = { status: 'online' };
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();
      const response = await request(app)
        .patch(`/api/cameras/${nonExistentId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send(newStatus);

      expect(response.statusCode).toBe(404);
    });
  });
});
