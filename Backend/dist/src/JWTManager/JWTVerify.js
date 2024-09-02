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
class JWTVerify {
    static base64UrlDecode(str) {
        const padding = '='.repeat((4 - str.length % 4) % 4);
        str = (str + padding).replace(/-/g, '+').replace(/_/g, '/');
        return Buffer.from(str, 'base64').toString('utf8');
    }
    static verifyJwt(token, secret) {
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
        const decodedPayload = JSON.parse(this.base64UrlDecode(encodedPayload));
        const now = Math.floor(Date.now() / 1000);
        if (decodedPayload.exp && decodedPayload.exp < now) {
            throw new Error('Token expired');
        }
        return decodedPayload;
    }
}
exports.default = JWTVerify;
