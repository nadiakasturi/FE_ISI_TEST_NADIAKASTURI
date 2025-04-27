export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../helpers/jwt';
import { prisma } from '../../../../../lib/prisma';
import { cookies } from 'next/headers';

export async function PUT(req: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);

    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = decoded.userId;
    const username = decoded.username; 
    const role = decoded.role;
    const userTeamId = decoded.teamId;

    const taskId = parseInt(params.taskId);
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    console.log(`Fetching task with ID: ${taskId}`);
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (role === 'Lead') {
      const body = await req.json();
      const { status, description, assignedToTeamId } = body;

      const validStatuses = ['Not Started', 'On Progress', 'Done', 'Reject'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          status,
          description,
          assignedToTeamId,
        },
      });

      await prisma.log.create({
        data: {
          action: `Lead updated task status to "${status}" and description, assigned task to team ID ${assignedToTeamId}`,
          userId,
          username, 
          entityId: taskId,
          entity: 'Task',
        },
      });

      console.log('Task successfully updated by Lead');
      return NextResponse.json(updatedTask, { status: 200 });
    }

    if (role === 'Team') {
      console.log(`Assigned team ID: ${task.assignedToTeamId}, User team ID: ${userTeamId}`);

      if (task.assignedToTeamId !== userTeamId) {
        console.log(`Task with ID ${taskId} is assigned to team ${task.assignedToTeamId}, but user belongs to team ${userTeamId}`);
        return NextResponse.json({ error: 'Task is not assigned to this team' }, { status: 403 });
      }

      const body = await req.json();
      const { status, description } = body;

      const validStatuses = ['Not Started', 'On Progress', 'Done', 'Reject'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          status,
          description,
        },
      });

      await prisma.log.create({
        data: {
          action: `Team member updated task status to "${status}" and description`,
          userId,
          username,  
          entityId: taskId,
          entity: 'Task',
        },
      });

      console.log('Task successfully updated by Team member');
      return NextResponse.json(updatedTask, { status: 200 });
    }

    return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Update failed:', err.message);
    } else {
      console.error('Update failed: Unknown error');
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
  const taskId = parseInt(params.taskId);

  if (isNaN(taskId)) {
    return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
  }

  try {
    console.log(`Fetching task with ID: ${taskId}`);
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.log('Task found:', task);
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}
