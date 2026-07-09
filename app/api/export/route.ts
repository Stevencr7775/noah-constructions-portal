import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as xlsx from 'xlsx';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'xlsx';
    
    // Fetch all properties with basic data for export
    const properties = await prisma.property.findMany({
      select: {
        propertyId: true,
        title: true,
        propertyType: true,
        status: true,
        totalPrice: true,
        city: true,
        locality: true,
        views: true,
        enquiries: true,
      }
    });

    if (format === 'csv') {
      const header = "ID,Title,Type,Status,Price,City,Locality,Views,Enquiries\n";
      const rows = properties.map(p => 
        `"${p.propertyId}","${p.title || ''}","${p.propertyType || ''}","${p.status}","${p.totalPrice || 0}","${p.city || ''}","${p.locality || ''}",${p.views},${p.enquiries}`
      ).join("\n");
      
      return new NextResponse(header + rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="properties_export.csv"',
        },
      });
    }

    if (format === 'xlsx') {
      const worksheet = xlsx.utils.json_to_sheet(properties);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Properties");
      
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="properties_export.xlsx"',
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });

  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
