"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
class JWTCreate {
    static base64UrlEncode(str) {
        return Buffer.from(str).toString('base64')
            .replace(/=/g, '') // Remove any trailing '='s
            .replace(/\+/g, '-') // '+' -> '-'
            .replace(/\//g, '_'); // '/' -> '_'
    }
    static createJwt(header, payload, secret) {
        // Time of expiration of the token - 1 hr.
        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60);
        payload = Object.assign(Object.assign({}, payload), { exp: expirationTime });
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
exports.default = JWTCreate;
