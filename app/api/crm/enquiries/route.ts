import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.phone) {
      return NextResponse.json({ success: false, error: "Name and phone are required" }, { status: 400 });
    }

    // Generate unique enquiry ID
    const enquiryCount = await prisma.lead.count();
    const enquiryId = `ENQ-${10000 + enquiryCount + 1}`;

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        enquiryId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
        contactMethod: data.contactMethod,
        preferredVisitDate: data.preferredVisitDate,
        preferredVisitTime: data.preferredVisitTime,
        source: data.source || "Website",
        propertyId: data.propertyId,
        sellerId: data.sellerId,
        buyerId: session?.user?.id || null, // Link to logged-in user if available
      }
    });

    // If it's a site visit, also create a SiteVisit record
    if (data.contactMethod === "Visit" && data.preferredVisitDate && data.propertyId && data.sellerId) {
       // Only create if buyerId exists (requires auth in actual app, but for CRM MVP we can just log it or require auth for visits)
       if (session?.user?.id) {
           await prisma.siteVisit.create({
               data: {
                   scheduledAt: new Date(`${data.preferredVisitDate}T${data.preferredVisitTime || '10:00'}:00`),
                   propertyId: data.propertyId,
                   sellerId: data.sellerId,
                   buyerId: session.user.id,
                   notes: data.message
               }
           });
       }
    }

    // Create a notification for the seller/admin
    if (data.sellerId) {
        await prisma.notification.create({
            data: {
                type: "Lead",
                message: `New enquiry received from ${data.name} for Property ${data.propertyId}`,
                sellerId: data.sellerId,
                link: `/seller/leads`
            }
        });
    }

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit enquiry" }, { status: 500 });
  }
}
