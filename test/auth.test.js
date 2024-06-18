const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const User = require('../models/User');

describe('Authentication API', () => {
    before(async () => {
        await User.sync({ force: true });
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password'
                });
            expect(res.status).to.equal(201);
        });
    });

    describe('POST /login', () => {
        it('should login an existing user', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password'
                });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password'
                });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
        });
    });

    describe('GET /profile', () => {
        it('should get the profile of the logged-in user', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password'
                });

            const token = loginRes.body.token;

            const profileRes = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', token);

            expect(profileRes.status).to.equal(200);
            expect(profileRes.body).to.have.property('email', 'test@example.com');
        });
    });
});

