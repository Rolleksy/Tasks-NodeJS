import JWTVerify from '../src/JWTManager/JWTVerify';
import JWTCreate from '../src/JWTManager/JWTCreate'; 
import { expect, test } from '@jest/globals';

describe('JWTVerify', () => {
    const secret = 'test_secret';
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { userId: 123 };

    const createValidToken = () => JWTCreate.createJwt(header, payload, secret);

    test('should verify a valid JWT token', () => {
        const token = createValidToken();
        const decodedPayload = JWTVerify.verifyJwt(token, secret);
        expect(decodedPayload).toEqual({ userId: 123, exp: expect.any(Number) });
    });

    test('should throw error for invalid signature', () => {
        const token = createValidToken();
        const invalidToken = token.replace(token.split('.')[2], 'invalid_signature');
        expect(() => JWTVerify.verifyJwt(invalidToken, secret)).toThrow('Invalid signature');
    });
});
