import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

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
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Determine type (simplified)
    let type = 'document';
    if (file.type.startsWith('image/')) type = 'image';
    if (file.type.startsWith('video/')) type = 'video';

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}`,
      type: type
    });

  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}
