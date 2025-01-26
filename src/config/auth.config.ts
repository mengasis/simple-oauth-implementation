export const authConfig = {
  jwks: {
    url: process.env.JWKS_URL || 'https://your-auth-server/.well-known/jwks.json'
  }
} as const; 