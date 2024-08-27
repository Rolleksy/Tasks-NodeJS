const crypto = require('crypto');

// Base64 URL encode function used to encode the header and payload of the JWT
function base64UrlEncode(str) {
    return Buffer.from(str).toString('base64')
        .replace(/=/g, '') // Remove any trailing '='s
        .replace(/\+/g, '-') // '+' -> '-'
        .replace(/\//g, '_'); // '/' -> '_'
}

function createJwt(header, payload, secret) {
    // Time of expiration of the token - 1 hr. - maybe fix
    const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60);
    payload.exp = expirationTime;
    
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    // Create the signature by hashing the encoded header and payload with the secret value
    const signature = crypto.createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

module.exports = createJwt;