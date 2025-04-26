import { prisma } from '../../../../lib/prisma';

export const logTaskUpdate = async (userId: number, taskId: number, status: string) => {
  await prisma.log.create({
    data: {
      action: `User ${userId} updated task ${taskId} status to "${status}"`,
      userId,
      entityId: taskId,
      entity: 'Task',
    },
  });
};
