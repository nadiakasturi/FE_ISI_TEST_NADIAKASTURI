import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../helpers/jwt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    teamId: user.teamId, 
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  });

  console.log('JWT Payload on login:', {
    userId: user.id,
    email: user.email,
    role: user.role,
    teamId: user.teamId,
  });

  const response = NextResponse.json({ message: 'Login success' });
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
  });

  return response;
}
