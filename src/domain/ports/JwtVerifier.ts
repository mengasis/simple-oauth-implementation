export interface JwtPayload {
  sub: string;
  email?: string;
  [key: string]: unknown;
}

export interface JwtVerifier {
  verifyToken(token: string): Promise<JwtPayload>;
} 