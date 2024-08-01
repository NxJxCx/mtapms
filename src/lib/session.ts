import { type JWTPayload, SignJWT, jwtVerify } from 'jose';
import 'server-only';

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: { [key: string]: any }, hours: number = 8) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${hours}h`)
    .sign(encodedKey)
}

export async function decrypt(session?: string): Promise<JWTPayload | { [key: string]: any } | void> {
  try {
    const { payload } = await jwtVerify(session || '', encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {}
}
