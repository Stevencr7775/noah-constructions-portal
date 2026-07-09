import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'BUYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const history = await prisma.recentlyViewed.findMany({
      where: { userId: session.id },
      include: {
        property: {
          include: { media: true }
        }
      },
      orderBy: { viewedAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'BUYER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { propertyId } = await request.json();
    if (!propertyId) return NextResponse.json({ error: 'Property ID required' }, { status: 400 });

    const existing = await prisma.recentlyViewed.findUnique({
      where: {
        userId_propertyId: { userId: session.id, propertyId }
      }
    });

    if (existing) {
      await prisma.recentlyViewed.update({
        where: { id: existing.id },
        data: { viewedAt: new Date() }
      });
    } else {
      await prisma.recentlyViewed.create({
        data: { userId: session.id, propertyId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
