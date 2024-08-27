const crypto = require('crypto');

// Base64 URL decode function used to decode the payload of the JWT
function base64UrlDecode(str) {
    let padding = '='.repeat((4 - str.length % 4) % 4);
    str = (str + padding).replace(/\-/g, '+').replace(/_/g, '/');
    return Buffer.from(str, 'base64').toString('utf8');
}

function verifyJwt(token, secret) {
    // Split the token into its parts - header, payload, and signature
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    // Verify the signature by recalculating it and comparing it to the one in the token
    const expectedSignature = crypto.createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
    }

    const decodedPayload = JSON.parse(base64UrlDecode(encodedPayload));

    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < now) {
        throw new Error('Token expired');
    }

    return decodedPayload;
}

module.exports = verifyJwt;
