const createJwt = require('../JWTManager/JWTCreate');
const crypto = require('crypto');

describe('createJwt', () => {
    const secret = 'mysecretkey';
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const payload = {
        sub: '1234567890',
        name: 'John Doe'
    };

    it('should create a valid JWT with the correct header, payload, and signature', () => {
        const token = createJwt(header, payload, secret);
        const [encodedHeader, encodedPayload, signature] = token.split('.');

        const expectedEncodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const expectedEncodedPayload = Buffer.from(JSON.stringify({
            ...payload,
            exp: expect.any(Number)
        })).toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const expectedSignature = crypto.createHmac('sha256', secret)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        expect(encodedHeader).toBe(expectedEncodedHeader);
        expect(encodedPayload).toMatch(/eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjox/g);
        expect(signature).toBe(expectedSignature);
    });

    it('should add an exp field to the payload with the correct expiration time', () => {
        const token = createJwt(header, payload, secret);
        const [, encodedPayload] = token.split('.');
        const decodedPayload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf8').replace(/-/g, '+').replace(/_/g, '/'));

        const expectedExp = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour expiration
        expect(decodedPayload.exp).toBeGreaterThanOrEqual(expectedExp - 1);
        expect(decodedPayload.exp).toBeLessThanOrEqual(expectedExp + 1);
    });

    it('should create a different JWT each time due to the dynamic exp field', async () => {
        const token1 = createJwt(header, payload, secret);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds to avoid creating the token at the same second
        const token2 = createJwt(header, payload, secret);
        
        expect(token1).not.toBe(token2);
    });
});
