
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.log.findMany({
      orderBy: {
        createdAt: 'desc', 
      },
      include: {
        user: true,  
      },
    });

    return new Response(JSON.stringify(logs), { status: 200 });
  } catch {
    return new Response('Error fetching logs', { status: 500 });
  }
}
