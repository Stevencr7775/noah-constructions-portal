import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as xlsx from 'xlsx';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'xlsx'; // xlsx or csv

    const properties = await prisma.property.findMany({
      include: {
        owner: true,
        agent: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const exportData = properties.map(p => ({
      'Property ID': p.propertyId,
      'Purpose': p.purpose,
      'Category': p.category,
      'District': p.district,
      'Locality': p.locality,
      'Plot Size': p.plotSize,
      'Facing': p.facing,
      'Road Size': p.roadSize,
      'Total Price (Rs)': p.totalPrice,
      'Status': p.status,
      'Owner/Agent': p.owner ? p.owner.name : (p.agent ? p.agent.name : 'N/A'),
      'Date Added': p.createdAt.toISOString().split('T')[0]
    }));

    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Properties");

    if (format === 'csv') {
      const csvBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'csv' });
      return new NextResponse(csvBuffer, {
        headers: {
          'Content-Disposition': 'attachment; filename="properties_export.csv"',
          'Content-Type': 'text/csv'
        }
      });
    } else {
      const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Disposition': 'attachment; filename="properties_export.xlsx"',
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
    }

  } catch (error: unknown) {
    console.error("Export error:", error);
    return NextResponse.json({ success: false, error: 'Export failed' }, { status: 500 });
  }
}
