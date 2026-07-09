import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let data: any[] = [];
    let filename = "report.xlsx";

    if (type === "properties") {
      const properties = await prisma.property.findMany({
        select: {
          propertyId: true,
          title: true,
          category: true,
          status: true,
          totalPrice: true,
          locality: true,
          city: true,
          state: true,
          createdAt: true
        }
      });
      
      data = properties.map(p => ({
        "Property ID": p.propertyId,
        "Title": p.title,
        "Category": p.category,
        "Status": p.status,
        "Total Price (₹)": p.totalPrice,
        "Locality": p.locality,
        "City": p.city,
        "State": p.state,
        "Created At": p.createdAt.toLocaleDateString()
      }));
      filename = "Properties_Report.xlsx";
    } 
    else if (type === "leads") {
      const leads = await prisma.lead.findMany({
        select: {
          enquiryId: true,
          name: true,
          phone: true,
          email: true,
          status: true,
          contactMethod: true,
          createdAt: true,
          property: { select: { propertyId: true } }
        }
      });

      data = leads.map(l => ({
        "Lead ID": l.enquiryId,
        "Name": l.name,
        "Phone": l.phone,
        "Email": l.email,
        "Status": l.status,
        "Pref. Contact": l.contactMethod,
        "Property ID": l.property?.propertyId || "General",
        "Created At": l.createdAt.toLocaleDateString()
      }));
      filename = "CRM_Leads_Report.xlsx";
    }
    else if (type === "sitevisits") {
      const visits = await prisma.siteVisit.findMany({
        select: {
          scheduledAt: true,
          status: true,
          buyer: { select: { name: true, phone: true } },
          property: { select: { propertyId: true, title: true } }
        }
      });

      data = visits.map(v => ({
        "Date": v.scheduledAt.toLocaleDateString(),
        "Time": v.scheduledAt.toLocaleTimeString(),
        "Status": v.status,
        "Buyer Name": v.buyer?.name,
        "Buyer Phone": v.buyer?.phone,
        "Property ID": v.property?.propertyId,
        "Property": v.property?.title
      }));
      filename = "Site_Visits_Report.xlsx";
    }
    else {
      return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    // Generate Excel Buffer
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Report");
    const buf = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      headers: {
        "Content-Disposition": `attachment; filename="\${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
