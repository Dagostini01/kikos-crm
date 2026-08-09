import { SignJWT, jwtVerify } from 'jose';

import type { Encrypter } from '@/cryptography/encrypter.js';

export class JoseEncrypter implements Encrypter {
  private readonly secret: Uint8Array;

  constructor(
    secret: string,
    private readonly expiresIn: string,
  ) {
    this.secret = new TextEncoder().encode(secret);
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.expiresIn)
      .sign(this.secret);
  }

  async decrypt(token: string): Promise<Record<string, unknown>> {
    const { payload } = await jwtVerify(token, this.secret);

    return payload as Record<string, unknown>;
  }
}
