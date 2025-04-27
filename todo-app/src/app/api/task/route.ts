export const dynamic = "force-dynamic";


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../helpers/jwt';  

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      console.log('Token tidak ditemukan');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    
    if (!decoded) {
      console.log('Token tidak valid');
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    console.log('Decoded token:', decoded);

    if (decoded.role !== 'Lead') {
      console.log('Role user tidak sesuai:', decoded.role);
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    console.log('Body request:', body);

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: 'Not Started',
        createdBy: decoded.userId,  
        assignedToUserId: body.assignedToUserId ?? null,
        teamId: body.teamId ?? null,
        assignedToTeamId: body.assignedToTeamId ?? null,
      },
    });

    console.log('Task created:', task);

    await prisma.log.create({
      data: {
        action: 'CREATE_TASK',
        userId: decoded.userId,  
        entity: 'Task',
        entityId: task.id,
        username: decoded.username,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const tasks = await prisma.task.findMany(); 
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil task' }, { status: 500 });
  }
}