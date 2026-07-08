import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      // Fetch all if no type provided
      const states = await prisma.state.findMany();
      const cities = await prisma.city.findMany();
      const districts = await prisma.district.findMany();
      const localities = await prisma.locality.findMany();
      const layoutApprovals = await prisma.layoutApproval.findMany();
      const propertyCategories = await prisma.propertyCategory.findMany();
      const plotSizes = await prisma.plotSize.findMany();
      const additionalPreferences = await prisma.additionalPreference.findMany();

      return NextResponse.json({
        success: true,
        data: {
          states, cities, districts, localities, 
          layoutApprovals, propertyCategories, plotSizes, additionalPreferences
        }
      });
    }

    // Fetch specific type
    let data;
    switch (type) {
      case 'state': data = await prisma.state.findMany(); break;
      case 'city': 
        const stateId = searchParams.get('stateId');
        data = await prisma.city.findMany({ where: stateId ? { stateId } : undefined }); 
        break;
      case 'district': 
        const cityId = searchParams.get('cityId');
        data = await prisma.district.findMany({ where: cityId ? { cityId } : undefined }); 
        break;
      case 'locality': 
        const districtId = searchParams.get('districtId');
        data = await prisma.locality.findMany({ where: districtId ? { districtId } : undefined }); 
        break;
      case 'layoutApproval': data = await prisma.layoutApproval.findMany(); break;
      case 'propertyCategory': data = await prisma.propertyCategory.findMany(); break;
      case 'plotSize': data = await prisma.plotSize.findMany(); break;
      case 'additionalPreference': data = await prisma.additionalPreference.findMany(); break;
      default: return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("Master Data GET error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, stateId, cityId, districtId } = body;

    if (!type || !name) {
      return NextResponse.json({ success: false, error: 'Type and name are required' }, { status: 400 });
    }

    let data;
    switch (type) {
      case 'state': 
        data = await prisma.state.create({ data: { name } }); 
        break;
      case 'city': 
        if (!stateId) return NextResponse.json({ success: false, error: 'stateId required' }, { status: 400 });
        data = await prisma.city.create({ data: { name, stateId } }); 
        break;
      case 'district': 
        if (!cityId) return NextResponse.json({ success: false, error: 'cityId required' }, { status: 400 });
        data = await prisma.district.create({ data: { name, cityId } }); 
        break;
      case 'locality': 
        if (!districtId) return NextResponse.json({ success: false, error: 'districtId required' }, { status: 400 });
        data = await prisma.locality.create({ data: { name, districtId } }); 
        break;
      case 'layoutApproval': 
        data = await prisma.layoutApproval.create({ data: { name } }); 
        break;
      case 'propertyCategory': 
        data = await prisma.propertyCategory.create({ data: { name } }); 
        break;
      case 'plotSize': 
        data = await prisma.plotSize.create({ data: { name } }); 
        break;
      case 'additionalPreference': 
        data = await prisma.additionalPreference.create({ data: { name } }); 
        break;
      default: return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: unknown) {
    console.error("Master Data POST error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
