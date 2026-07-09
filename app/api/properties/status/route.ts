import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Property ID and status are required' }, { status: 400 });
    }

    const existingProperty = await prisma.property.findUnique({ where: { id } });
    if (!existingProperty) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.role);
    const isOwner = existingProperty.sellerId === session.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Role-based status constraints
    const validStatusesForOwner = ['Draft', 'Pending Review', 'Reserved', 'Sold', 'Archived'];
    const validStatusesForAdmin = ['Approved', 'Published', 'Rejected', 'Pending Review', 'Archived'];

    if (isOwner && !isAdmin && !validStatusesForOwner.includes(status)) {
      return NextResponse.json({ error: `Owners cannot set status to ${status}` }, { status: 403 });
    }

    if (isAdmin && !validStatusesForAdmin.includes(status)) {
       return NextResponse.json({ error: `Admins cannot set status to ${status}` }, { status: 403 });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, data: updatedProperty });
  } catch (error: any) {
    console.error('Property status update error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
