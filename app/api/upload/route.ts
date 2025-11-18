import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files = data.getAll('files') as File[];
    const category = (data.get('category') as string) || 'misc';
    const subcategory = (data.get('subcategory') as string) || 'general';
    const userId = (data.get('userId') as string) || 'anonymous';
    const postId = (data.get('postId') as string) || null;

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
    const storedKeys: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;

      const subfolder = getSubfolder(file, category, subcategory);
      const postSegment = postId ? `post_${postId}/` : '';
      const key = `user/${userId}/${postSegment}${subfolder}/${filename}`;

      const blob = await put(key, buffer, { access: 'public' });
      urls.push(blob.url);
      storedKeys.push(key);
    }

    return NextResponse.json({ urls, keys: storedKeys });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
