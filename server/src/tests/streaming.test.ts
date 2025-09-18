import request from 'supertest';
import express from 'express';
import streamingRoutes from '../streaming/server';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const app = express();
app.use('/api', streamingRoutes);

describe('GET /api/camera-feeds', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return camera feeds on successful API call', async () => {
    const mockWindyResponse = {
      data: {
        webcams: [
          {
            webcamId: '123',
            title: 'Test Camera',
            location: {
              city: 'Test City',
              country: 'Test Country',
            },
            player: {
              live: 'http://example.com/live',
              day: '',
              month: '',
              year: '',
            },
            lastUpdatedOn: new Date().toISOString(),
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(mockWindyResponse);

    const res = await request(app).get('/api/camera-feeds');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]).toEqual({
      id: '123',
      name: 'Test Camera',
      url: 'http://example.com/live',
      location: 'Test City, Test Country',
      status: 'online',
      recording: true,
      lastUpdated: expect.any(String),
    });
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should return 500 on API call failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Windy API is down'));

    const res = await request(app).get('/api/camera-feeds');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Failed to fetch camera feeds');
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should handle empty webcams array from Windy API', async () => {
    const mockWindyResponse = {
      data: {
        webcams: [],
      },
    };

    // Mock the first call (traffic) to return empty, and the second (popular) also empty
    mockedAxios.get.mockResolvedValue(mockWindyResponse);

    const res = await request(app).get('/api/camera-feeds');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Failed to fetch camera feeds');
    expect(res.body.details).toBe('No cameras available');
    // It should be called twice, once for traffic and once for popular
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('should return 401 on authentication failure', async () => {
    mockedAxios.get.mockRejectedValue({
      response: { status: 401, data: 'Invalid API key' },
    });

    const res = await request(app).get('/api/camera-feeds');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('API authentication failed');
  });
});
