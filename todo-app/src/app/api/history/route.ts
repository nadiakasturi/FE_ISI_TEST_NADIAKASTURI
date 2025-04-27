
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
    console.log(logs);
    return new Response(JSON.stringify(logs), { status: 200 });
  } catch (error) {
    return new Response('Error fetching history', { status: 500 });
  }
}
