import * as crypto from 'crypto';

class JWTCreate {
    public static base64UrlEncode(str: string): string {
        return Buffer.from(str).toString('base64')
            .replace(/=/g, '') // Remove any trailing '='s
            .replace(/\+/g, '-') // '+' -> '-'
            .replace(/\//g, '_'); // '/' -> '_'
    }

    public static createJwt(header: object, payload: object, secret: string): string {
        // Time of expiration of the token - 1 hr.
        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60);
        payload = { ...payload, exp: expirationTime };

        const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));

        // Create the signature by hashing the encoded header and payload with the secret value
        const signature = crypto.createHmac('sha256', secret)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
}

export default JWTCreate;
