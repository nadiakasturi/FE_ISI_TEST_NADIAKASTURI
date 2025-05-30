export const dynamic = "force-dynamic";

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
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  });

  console.log('JWT Payload on login:', {
    userId: user.id,
    email: user.email,
    role: user.role,
    teamId: user.teamId,
  });

  return NextResponse.json({
    message: 'Login success',
    token,
  });
}
