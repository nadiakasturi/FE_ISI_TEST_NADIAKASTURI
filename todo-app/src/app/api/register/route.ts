export const dynamic = "force-dynamic";

import { prisma } from '../../../../lib/prisma'; 
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const body = await req.json();
  const { username, email, password, role, teamId } = body;


  if (role === 'Lead') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword, 
        role,
    
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  }

  if (!teamId) {
    return new Response('Team ID is required', { status: 400 });
  }
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    return new Response('Team not found', { status: 404 });
  }

  const hashedPassword = await bcrypt.hash(password, 10); 
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
      teamId, 
    },
  });

  return new Response(JSON.stringify(user), { status: 201 });
}
