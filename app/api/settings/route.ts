import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group");
    
    const settings = await prisma.websiteSetting.findMany({
      where: group ? { group } : undefined
    });
    
    // Convert array to object { key: value }
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    return NextResponse.json(settingsObj);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { group, settings } = data; // settings is { key: value }
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Upsert all settings
    const operations = Object.entries(settings).map(([key, value]) => {
      return prisma.websiteSetting.upsert({
        where: { key },
        update: { value: String(value), group: group || 'General' },
        create: { key, value: String(value), group: group || 'General' }
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
