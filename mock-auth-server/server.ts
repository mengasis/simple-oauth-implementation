import express, { type Request, type Response } from 'express';
import { SignJWT } from 'jose';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const app = express();
const PORT = 4000;
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, 'public.key'), 'utf8');
const KID = '1234';

// Convert PEM private key to KeyLike format
const privateKey = crypto.createPrivateKey(PRIVATE_KEY);
const publicKey = crypto.createPublicKey(PUBLIC_KEY);

app.use(express.json());

app.post('/login', async (req: Request, res: Response) => {
  const { username } = req.body;
  if (username === 'authenticatedUser') {
    const token = await new SignJWT({ 
      sub: '1234567890',
      name: 'John Doe',
      admin: true
    })
      .setProtectedHeader({ alg: 'RS256', kid: KID })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(privateKey);

    return res.json({ token });
  }
  return res.status(401).json({ error: 'Unauthorized' });
});

app.get('/.well-known/jwks.json', (req: Request, res: Response) => {
  // Extract modulus and exponent from public key
  const keyDetails = crypto.createPublicKey(PUBLIC_KEY).export({
    format: 'jwk'
  }) as {
    n: string;
    e: string;
  };

  res.json({
    keys: [
      {
        kty: 'RSA',
        kid: KID,
        use: 'sig',
        alg: 'RS256',
        n: keyDetails.n,
        e: keyDetails.e
      }
    ]
  });
});

app.get('/callback', (req: Request, res: Response) => {
  const { code } = req.query;
  console.log('Callback received with code:', code);
  res.send('Callback received');
});

app.listen(PORT, () => {
  console.log(`Mock Auth Server running on http://localhost:${PORT}`);
});