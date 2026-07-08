import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all properties with their seller details
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        seller: true,
        media: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ properties });
  } catch (error: any) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// PATCH to update property status (e.g. Approve, Reject)
export async function PATCH(req: Request) {
  try {
    const { id, status, isFeatured } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (isFeatured !== undefined) dataToUpdate.isFeatured = isFeatured;

    const property = await prisma.property.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ property });
  } catch (error: any) {
    console.error('Failed to update property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE a property
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    await prisma.property.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
