export const authConfig = {
  jwks: {
    url: process.env.JWKS_URL || 'http://localhost:4000/.well-known/jwks.json'
  }
} as const; 