import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET properties for the logged-in user
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const property = await prisma.property.findUnique({
        where: { id },
        include: { media: true, seller: true }
      });
      // Check authorization
      if (property?.sellerId !== session.id && !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json({ success: true, data: property });
    }

    // List properties for the logged-in user (Admin sees all, Seller sees own)
    const whereClause = ['ADMIN', 'SUPER_ADMIN'].includes(session.role) ? {} : { sellerId: session.id };
    const properties = await prisma.property.findMany({
      where: whereClause,
      include: { media: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// POST create a new property
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const propertyId = `PROP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const newProperty = await prisma.property.create({
      data: {
        ...data,
        propertyId,
        sellerId: session.id, // Enforce current user as seller
        status: 'Draft',
        // Filter out any relation data like media for initial creation, we handle media separately or map it
        media: data.media ? {
          create: data.media.map((m: any) => ({
            url: m.url,
            type: m.type,
            documentType: m.documentType
          }))
        } : undefined
      }
    });

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error: any) {
    console.error('Property creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// PUT update a property
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const { id, media, ...updateData } = data;

    if (!id) return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });

    const existingProperty = await prisma.property.findUnique({ where: { id } });
    if (!existingProperty) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Authorization
    if (existingProperty.sellerId !== session.id && !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Media update logic (delete old media and create new, or just create new)
    // For simplicity, we delete all existing media and replace if media array is provided
    const updatePayload: any = { ...updateData };
    
    if (media) {
      updatePayload.media = {
        deleteMany: {},
        create: media.map((m: any) => ({
          url: m.url,
          type: m.type,
          documentType: m.documentType
        }))
      };
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updatePayload
    });

    return NextResponse.json({ success: true, data: updatedProperty });
  } catch (error: any) {
    console.error('Property update error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// DELETE soft-delete property
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });

    const existingProperty = await prisma.property.findUnique({ where: { id } });
    if (!existingProperty) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (existingProperty.sellerId !== session.id && !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete by updating status to Archived
    const archivedProperty = await prisma.property.update({
      where: { id },
      data: { status: 'Archived' }
    });

    return NextResponse.json({ success: true, data: archivedProperty });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
