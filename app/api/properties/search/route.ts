import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    // Global query
    const q = searchParams.get('q');
    
    // Advanced Filters
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const purpose = searchParams.get('purpose');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    const facing = searchParams.get('facing');
    const city = searchParams.get('city');
    const sort = searchParams.get('sort');

    // Build the query
    const where: any = {
      status: 'Published', // Only show published properties in public search
    };

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { propertyId: { contains: q } },
        { locality: { contains: q } },
        { city: { contains: q } },
        { district: { contains: q } },
        { seller: { name: { contains: q } } },
        { seller: { companyName: { contains: q } } },
      ];
      
      // Analytics: Fire and forget tracking of search keyword
      prisma.searchAnalytics.create({
        data: { keyword: q, location: city || null, category: category || null }
      }).catch(e => console.error("Analytics Error", e));
    }

    if (type) where.propertyType = type;
    if (category) where.category = category;
    if (purpose) where.purpose = purpose;
    if (city) where.city = city;
    if (facing) where.facing = facing;

    // if (minPrice || maxPrice) {
    //   where.totalPrice = {};
    //   if (minPrice) where.totalPrice.gte = parseFloat(minPrice);
    //   if (maxPrice) where.totalPrice.lte = parseFloat(maxPrice);
    // }

    if (minArea || maxArea) {
      // Assuming area in squareYards for general search
      where.squareYards = {};
      if (minArea) where.squareYards.gte = parseFloat(minArea);
      if (maxArea) where.squareYards.lte = parseFloat(maxArea);
    }

    // Sorting logic
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { totalPrice: 'asc' };
    if (sort === 'price_desc') orderBy = { totalPrice: 'desc' };
    if (sort === 'area_desc') orderBy = { squareYards: 'desc' };
    if (sort === 'views_desc') orderBy = { views: 'desc' };

    const [properties, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        include: {
          media: true,
          seller: { select: { type: true, name: true, companyName: true } }
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
