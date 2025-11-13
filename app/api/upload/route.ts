import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll('files') as File[];
    const category = data.get('category') as string;
    const subcategory = data.get('subcategory') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Trebuie să încărcați cel puțin un fișier.' }, { status: 400 });
    }

    const getSubfolder = (file: File, category: string, subcategory: string): string => {
      if (file.type.startsWith('image/')) {
        return `${category}_${subcategory}_images`;
      } else if (file.type.startsWith('video/')) {
        return `${category}_${subcategory}_videos`;
      } else {
        return `${category}_${subcategory}_documents`;
      }
    };

    const urls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;

      const subfolder = getSubfolder(file, category, subcategory);
      const key = `${subfolder}/${filename}`;
      const blob = await put(key, buffer, { access: 'public' });
      urls.push(blob.url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
