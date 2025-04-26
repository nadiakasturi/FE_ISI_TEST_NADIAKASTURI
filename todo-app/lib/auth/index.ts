import jwt from 'jsonwebtoken';
import * as jose from 'jose';

const jwtSecret = process.env.JWT_SECRET as string;

export const signToken = (payload: { _id: string; email: string; role: string }) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = async (token: string): Promise<jwt.JwtPayload | null> => {
  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as jwt.JwtPayload;  
  } catch (error) {
    console.error('Token verification error:', error);  
    return null; 
  }
};
