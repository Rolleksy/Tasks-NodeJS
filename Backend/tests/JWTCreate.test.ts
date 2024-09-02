import JWTCreate from '../src/JWTManager/JWTCreate'; 
import { expect, test } from '@jest/globals';

describe('JWTCreate', () => {
    const secret = 'test_secret';

    test('should create a JWT token with given header and payload', () => {
        const header = { alg: 'HS256', typ: 'JWT' };
        const payload = { userId: 123 };
        const token = JWTCreate.createJwt(header, payload, secret);

        const [encodedHeader, encodedPayload, signature] = token.split('.');

        const expectedHeader = JWTCreate.base64UrlEncode(JSON.stringify(header));
        const expectedPayload = JWTCreate.base64UrlEncode(JSON.stringify({ ...payload, exp: expect.any(Number) }));

        expect(encodedHeader).toBe(expectedHeader);
        expect(encodedPayload).toMatch(/^[A-Za-z0-9_-]+$/);

        expect(signature.length).toBeGreaterThan(0);
    });
});