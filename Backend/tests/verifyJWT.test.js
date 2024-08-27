const crypto = require('crypto');
const verifyJwt = require('../JWTManager/JWTVerify');

describe('verifyJwt', () => {
    const secret = 'mysecretkey';
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const payload = {
        sub: '1234567890',
        name: 'John Doe',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const signature = crypto.createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const validToken = `${encodedHeader}.${encodedPayload}.${signature}`;

    it('should decode and verify a valid JWT', () => {
        const result = verifyJwt(validToken, secret);
        expect(result.sub).toBe(payload.sub);
        expect(result.name).toBe(payload.name);
        expect(result.iat).toBe(payload.iat);
    });

    it('should throw an error for invalid signature', () => {
        const invalidToken = `${encodedHeader}.${encodedPayload}.invalidsignature`;
        expect(() => verifyJwt(invalidToken, secret)).toThrow('Invalid signature');
    });

    it('should throw an error for expired token', () => {
        const expiredPayload = { ...payload, exp: Math.floor(Date.now() / 1000) - 10 };
        const expiredEncodedPayload = Buffer.from(JSON.stringify(expiredPayload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        const expiredSignature = crypto.createHmac('sha256', secret)
            .update(`${encodedHeader}.${expiredEncodedPayload}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const expiredToken = `${encodedHeader}.${expiredEncodedPayload}.${expiredSignature}`;

        expect(() => verifyJwt(expiredToken, secret)).toThrow('Token expired');
    });

    it('should decode and verify a token without exp field', () => {
        const payloadWithoutExp = {
            sub: '1234567890',
            name: 'John Doe',
            iat: Math.floor(Date.now() / 1000)
        };

        const encodedPayloadWithoutExp = Buffer.from(JSON.stringify(payloadWithoutExp)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        const signatureWithoutExp = crypto.createHmac('sha256', secret)
            .update(`${encodedHeader}.${encodedPayloadWithoutExp}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const tokenWithoutExp = `${encodedHeader}.${encodedPayloadWithoutExp}.${signatureWithoutExp}`;

        const result = verifyJwt(tokenWithoutExp, secret);
        expect(result.sub).toBe(payloadWithoutExp.sub);
        expect(result.name).toBe(payloadWithoutExp.name);
        expect(result.iat).toBe(payloadWithoutExp.iat);
    });
});
