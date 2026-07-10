import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Generate a unique Property ID (e.g. PR-12345)
    const propertyId = `PR-${Math.floor(10000 + Math.random() * 90000)}`;

    const {
      purpose, category, state, city, district, locality, plotSize, facing, roadSize,
      totalPrice, pricePerSqYard, isNegotiable, description, status, isFeatured,
      latitude, longitude, layoutApprovals, amenities, googleMapsUrl, developmentRatio,
      ownerType, ownerDetails, agentDetails, mediaFiles
    } = data;

    // Create Property
    const property = await prisma.property.create({
      data: {
        propertyId, purpose, category, state, city, district, locality, plotSize, facing, roadSize,
        totalPrice: totalPrice || null,
        pricePerSqYard: pricePerSqYard || null,
        isNegotiable: Boolean(isNegotiable),
        description, status, isFeatured: Boolean(isFeatured),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        googleMapsUrl: googleMapsUrl || null,
        developmentRatio: developmentRatio || null,
        layoutApprovals: JSON.stringify(layoutApprovals || []),
        amenities: JSON.stringify(amenities || []),
        
        // Use unified Seller relation
        ...(ownerType === 'Owner' && ownerDetails ? {
          seller: {
            create: {
              type: 'OWNER',
              name: ownerDetails.name,
              mobile: ownerDetails.mobile,
              email: ownerDetails.email || `${Math.random()}@example.com`,
              password: 'defaultPassword',
              address: ownerDetails.address
            }
          }
        } : {}),

        ...(ownerType === 'Agent' && agentDetails ? {
          seller: {
            create: {
              type: 'AGENT',
              name: agentDetails.name,
              agency: agentDetails.agency,
              mobile: agentDetails.mobile,
              email: agentDetails.email || `${Math.random()}@example.com`,
              password: 'defaultPassword',
              reraNumber: agentDetails.reraNumber
            }
          }
        } : {}),

        // Media creation
        ...(mediaFiles && mediaFiles.length > 0 ? {
          media: {
            create: mediaFiles.map((file: { url: string, type: string }) => ({
              url: file.url,
              type: file.type
            }))
          }
        } : {})
      },
      include: {
        seller: true,
        media: true
      }
    });

    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (error: unknown) {
    console.error("Property creation error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build query filters based on params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    
    if (searchParams.get('category')) filters.category = searchParams.get('category');
    if (searchParams.get('purpose')) filters.purpose = searchParams.get('purpose');
    if (searchParams.get('district')) filters.district = searchParams.get('district');
    if (searchParams.get('locality')) filters.locality = searchParams.get('locality');
    if (searchParams.get('status')) filters.status = searchParams.get('status');
    if (searchParams.get('isFeatured') === 'true') filters.isFeatured = true;

    // Range queries for budget
    // const minBudget = searchParams.get('minBudget');
    // const maxBudget = searchParams.get('maxBudget');
    // if (minBudget || maxBudget) {
    //   filters.totalPrice = {};
    //   if (minBudget) filters.totalPrice.gte = parseFloat(minBudget);
    //   if (maxBudget) filters.totalPrice.lte = parseFloat(maxBudget);
    // }

    const properties = await prisma.property.findMany({
      where: filters,
      include: {
        seller: true,
        media: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: properties });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
