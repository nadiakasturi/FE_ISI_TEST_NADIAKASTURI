import { NextResponse } from 'next/server';
import { verifyToken } from '../../lib/auth';
import { JwtPayload } from 'jsonwebtoken';  


interface Payload extends JwtPayload {
  userId: string;
  teamId: string | number;
  role: string;
}

interface CustomRequest extends Request {
  user?: Payload;
  teamId?: string | number;
}

export async function middleware(req: CustomRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const payload = await verifyToken(token);

    if (!payload) {
      return new NextResponse('Invalid token', { status: 401 });
    }

    req.user = payload as Payload; 
    req.teamId = payload.teamId;

    console.log('User in middleware:', req.user);
  } catch (error: unknown) {
  
    if (error instanceof Error) {
      console.error('Error verifying token:', error.message);
    }
    return new NextResponse('Invalid token', { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/tasks/*', '/api/users/*'],
};
