import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cameraRoutes from '../routes/cameras';
import { User } from '../models/User';
import { Camera } from '../models/Camera';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/cameras', cameraRoutes);

// Mock the protect middleware
jest.mock('../middleware/auth', () => ({
    protect: (req: any, res: any, next: any) => {
      req.user = { id: new mongoose.Types.ObjectId().toHexString() };
      next();
    },
}));

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/test-db-cameras`;
    await mongoose.connect(url);
});

afterEach(async () => {
    await Camera.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Camera Endpoints', () => {
    it('should create a new camera', async () => {
        const res = await request(app)
            .post('/api/cameras')
            .send({
                name: 'Test Camera',
                url: 'rtsp://test.com/camera1',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toBe('Test Camera');
    });

    it('should get all cameras', async () => {
        await Camera.create({ name: 'Cam 1', url: 'url1' });
        await Camera.create({ name: 'Cam 2', url: 'url2' });

        const res = await request(app).get('/api/cameras');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(2);
    });

    it('should return an empty array if no cameras exist', async () => {
        const res = await request(app).get('/api/cameras');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});
