import request from 'supertest';
import app from '../index';
import { User } from '../models/User';

describe('Auth Routes - Registration', () => {
  const newUser = {
    name: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    country: 'US',
  };

  it('should register a user successfully with valid data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    // Check response
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toMatchObject({
      name: 'testuser',
      email: 'test@example.com',
    });

    // Check database
    const dbUser = await User.findOne({ email: 'test@example.com' });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.name).toBe('testuser');
  });

  it('should fail to register a user with a duplicate email', async () => {
    // First, create a user
    await request(app).post('/api/auth/register').send(newUser);

    // Then, try to create another user with the same email
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...newUser, name: 'anotheruser' });

    // Check response
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should fail to register a user with missing required fields', async () => {
    const { password, ...userWithoutPassword } = newUser;
    const response = await request(app)
      .post('/api/auth/register')
      .send(userWithoutPassword);

    // Check response
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Path `password` is required.');
  });
});

describe('Auth Middleware', () => {
  let token: string;

  beforeEach(async () => {
    // Register and log in a user to get a token
    const userCredentials = {
      email: 'middleware.test@example.com',
      password: 'password123',
    };
    await request(app)
      .post('/api/auth/register')
      .send({ ...userCredentials, name: 'middlewaretester', country: 'US' });

    const response = await request(app)
      .post('/api/auth/login')
      .send(userCredentials);

    token = response.body.token;
  });

  it('should deny access to a protected route without a token', async () => {
    const response = await request(app).get('/api/cameras');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Not authorized, no token');
  });

  it('should deny access to a protected route with an invalid token', async () => {
    const response = await request(app)
      .get('/api/cameras')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Not authorized');
  });

  it('should allow access to a protected route with a valid token', async () => {
    const response = await request(app)
      .get('/api/cameras')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});

describe('Auth Routes - Login', () => {
  const userCredentials = {
    email: 'login.test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    // Register a user before each login test
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'logintester',
        country: 'CA',
        ...userCredentials,
      });
  });

  it('should log in a registered user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(userCredentials);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.email).toBe(userCredentials.email);
  });

  it('should fail to log in with an incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ ...userCredentials, password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should fail to log in with a non-existent email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });
});
