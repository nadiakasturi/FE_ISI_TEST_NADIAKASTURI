import * as jose from 'jose';

const jwtSecret = process.env.JWT_SECRET as string;

export interface CustomJwtPayload extends jose.JWTPayload {
  userId: number;
  email: string;
  role: string;
  username: string;
}

export const signToken = (payload: CustomJwtPayload) => {
  const secret = new TextEncoder().encode(jwtSecret);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
};


export const verifyToken = async (token: string): Promise<CustomJwtPayload | null> => {
  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as CustomJwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
