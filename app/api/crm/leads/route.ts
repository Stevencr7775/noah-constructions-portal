import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        // In a real app, we'd allow SELLERS to see their own leads too. For this MVP, we enforce ADMIN.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query: any = {};
    if (status) {
        query.status = status;
    }

    const leads = await prisma.lead.findMany({
      where: query,
      include: {
        property: {
            select: { title: true, locality: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, leads });

  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, status } = data;

    if (!id || !status) {
        return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const lead = await prisma.lead.update({
        where: { id },
        data: { status }
    });

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 500 });
  }
}
