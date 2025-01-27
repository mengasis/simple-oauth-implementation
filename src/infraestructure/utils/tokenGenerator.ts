import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex'); // Generates a random token
}

export function generateAccessToken(clientId: string, scopes: string[]): string {
  const payload = {
    clientId,
    scopes,
  };
  const secret = process.env.JWT_SECRET || 'your_jwt_secret'; 
  const options = { expiresIn: 300 }; 
  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
} 