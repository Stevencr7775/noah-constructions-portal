import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET favorites for user
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'BUYER') {
      return NextResponse.json({ error: 'Unauthorized. Only buyers can view favorites.' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.id },
      include: {
        property: {
          include: { media: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: favorites });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST toggle favorite
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'BUYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId } = await request.json();
    if (!propertyId) return NextResponse.json({ error: 'Property ID required' }, { status: 400 });

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId: session.id, propertyId }
      }
    });

    if (existing) {
      // Remove it
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, status: 'removed' });
    } else {
      // Add it
      await prisma.favorite.create({
        data: { userId: session.id, propertyId }
      });
      return NextResponse.json({ success: true, status: 'added' });
    }

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
