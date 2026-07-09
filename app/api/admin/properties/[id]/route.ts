import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET single property by id
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: { seller: true, media: true }
    });
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ property });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — full update of a property
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      purpose, category, state, city, district, locality,
      plotSize, facing, roadSize, totalPrice, pricePerSqYard,
      isNegotiable, description, status, isFeatured,
      googleMapsUrl, developmentRatio,
      layoutApprovals = [], amenities = [],
      ownerType, ownerDetails, agentDetails
    } = body;

    // Build seller update data
    const contactData = ownerType === 'Owner' ? ownerDetails : agentDetails;

    // Find existing seller for this property
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: { seller: true }
    });

    // Update seller if exists
    if (existingProperty?.sellerId && contactData?.name) {
      await prisma.seller.update({
        where: { id: existingProperty.sellerId },
        data: {
          name: contactData.name || undefined,
          mobile: contactData.mobile || undefined,
          email: contactData.email || undefined,
          address: contactData.address || undefined,
          agency: contactData.agency || undefined,
          reraNumber: contactData.reraNumber || undefined,
        }
      });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        purpose: purpose || undefined,
        category: category || undefined,
        state: state || undefined,
        city: city || undefined,
        district: district || undefined,
        locality: locality || undefined,
        plotSize: plotSize || undefined,
        facing: facing || undefined,
        roadSize: roadSize || undefined,
        totalPrice: totalPrice || undefined,
        pricePerSqYard: pricePerSqYard || undefined,
        isNegotiable: isNegotiable ?? undefined,
        description: description || undefined,
        status: status || undefined,
        isFeatured: isFeatured ?? undefined,
        googleMapsUrl: googleMapsUrl || undefined,
        developmentRatio: developmentRatio || undefined,
        layoutApprovals: JSON.stringify(layoutApprovals.filter(Boolean)),
        amenities: JSON.stringify(amenities.filter(Boolean)),
      }
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    console.error('PUT property error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
