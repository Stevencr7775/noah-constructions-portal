import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. Process Seller Data
    const sellerType = formData.get('seller_type') as string;
    const name = formData.get('seller_name') as string;
    const mobile = formData.get('seller_mobile') as string;
    const email = formData.get('seller_email') as string;
    const password = formData.get('seller_password') as string;
    const address = formData.get('seller_address') as string || null;
    const city = formData.get('seller_city') as string || null;
    const state = formData.get('seller_state') as string || 'Telangana';

    // Type specific fields
    const agency = formData.get('seller_agency') as string || null;
    const reraNumber = formData.get('seller_reraNumber') as string || null;
    const experience = formData.get('seller_experience') as string || null;
    const companyName = formData.get('seller_companyName') as string || null;
    const regNumber = formData.get('seller_regNumber') as string || null;
    const website = formData.get('seller_website') as string || null;
    const contactPerson = formData.get('seller_contactPerson') as string || null;
    const designation = formData.get('seller_designation') as string || null;
    const companySize = formData.get('seller_companySize') as string || null;
    const businessReq = formData.get('seller_businessReq') as string || null;

    if (!sellerType || !email || !password) {
      return NextResponse.json({ error: 'Missing required seller fields (Type, Email, Password)' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Process Property Data
    const propertyPurpose = formData.get('prop_purpose') as string;
    // Multi-selects are sent as comma separated strings or multiple fields
    const propertyCategories = formData.getAll('prop_category') as string[];
    const propState = formData.get('prop_state') as string || 'Telangana';
    const propCity = formData.get('prop_city') as string || 'Hyderabad';
    const propDistrict = formData.get('prop_district') as string;
    const propLocality = formData.get('prop_locality') as string;
    const propPlotSize = formData.get('prop_plotSize') as string;
    const propFacing = formData.get('prop_facing') as string;
    const propLayoutApprovals = formData.getAll('prop_layout') as string[];
    const propRoadWidth = formData.get('prop_roadWidth') as string;
    const propTotalPriceStr = formData.get('prop_totalPrice') as string;
    const propTotalPrice = propTotalPriceStr ? parseFloat(propTotalPriceStr) : null;
    const propPricePerSqYard = parseFloat(formData.get('prop_pricePerSqYard') as string) || null;
    const propNegotiable = formData.get('prop_negotiable') === 'true';
    const propDescription = formData.get('prop_description') as string;
    const propAmenities = formData.getAll('prop_amenities') as string[];
    
    const propLat = parseFloat(formData.get('prop_lat') as string) || null;
    const propLng = parseFloat(formData.get('prop_lng') as string) || null;



    // Process Files
    const mediaFiles = formData.getAll('media') as File[];
    const savedMediaUrls: { url: string; type: string }[] = [];

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    for (const file of mediaFiles) {
      if (file && typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = file.name.split('.').pop();
        const filename = `${uniqueSuffix}.${ext}`;
        const filepath = join(uploadDir, filename);
        
        await writeFile(filepath, buffer);
        
        // Determine type
        let type = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        
        savedMediaUrls.push({ url: `/uploads/${filename}`, type });
      }
    }

    // 3. Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find or create seller based on email
      let seller = await tx.seller.findUnique({
        where: { email }
      });

      if (!seller) {
        seller = await tx.seller.create({
          data: {
            type: sellerType,
            name,
            mobile,
            email,
            password: hashedPassword,
            address,
            city,
            state,
            agency,
            reraNumber,
            experience,
            companyName,
            regNumber,
            website,
            contactPerson,
            designation,
            companySize,
            businessReq
          }
        });
      }

      // Generate unique Property ID
      const propertyId = `PROP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      // Create property
      const property = await tx.property.create({
        data: {
          propertyId,
          sellerId: seller.id,
          purpose: propertyPurpose,
          category: propertyCategories.join(','),
          state: propState,
          city: propCity,
          district: propDistrict,
          locality: propLocality,
          plotSize: propPlotSize,
          facing: propFacing,
          layoutApprovals: propLayoutApprovals.join(','),
          roadSize: propRoadWidth?.toString(),
          totalPrice: propTotalPrice?.toString(),
          pricePerSqYard: propPricePerSqYard?.toString(),
          isNegotiable: propNegotiable,
          description: propDescription,
          amenities: propAmenities.join(','),
          latitude: propLat,
          longitude: propLng,
          status: 'Pending Approval',
          media: {
            create: savedMediaUrls.map(media => ({
              url: media.url,
              type: media.type
            }))
          }
        }
      });

      return property;
    });

    return NextResponse.json({ success: true, propertyId: result.propertyId }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
