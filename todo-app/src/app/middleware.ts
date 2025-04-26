import { NextResponse } from 'next/server';
import { verifyToken } from '../../lib/auth'; 

export async function middleware(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const payload = await verifyToken(token); 

    if (!payload) {
      return new NextResponse('Invalid token', { status: 401 });
    }

    (req as any).user = payload; 

    (req as any).teamId = payload.teamId;


    console.log('User in middleware:', (req as any).user); 

  } catch (error) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/tasks/*', '/api/users/*'], 
};
