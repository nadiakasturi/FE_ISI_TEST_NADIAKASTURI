import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  email: string;
}

export const logTaskUpdate = async (req: NextRequest, taskId: number, status: string) => {

  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    console.log('Decoded token:', decoded);

    const username = decoded.username ?? 'Unknown'; 
    console.log("Username being used:", username);
    const userId = decoded.userId;

    console.log(`Saving log: User ${userId} updated task ${taskId} status to "${status}" with username "${username}"`);

    await prisma.log.create({
      data: {
        action: "Test action",  
        userId: userId,  
        entityId: taskId,  
        entity: "Task",  
        username: username, 
      },
    });

    console.log("Log successfully created.");
    return NextResponse.json({ message: 'Log created successfully' });

  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
};
