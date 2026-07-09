import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = formData.get('documentType') as string | null;
    const mediaTypeOverride = formData.get('mediaType') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + '.' + file.name.split('.').pop();
    
    // Save to public/uploads
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Determine type (image, video, drone, 360, floor_plan, document)
    let type = 'document';
    if (file.type.startsWith('image/')) type = 'image';
    if (file.type.startsWith('video/')) type = 'video';
    
    if (mediaTypeOverride) {
      type = mediaTypeOverride;
    }

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}`,
      type: type,
      documentType: documentType || null
    });

  } catch (error: unknown) {
    console.error("Upload media error:", error);
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}
