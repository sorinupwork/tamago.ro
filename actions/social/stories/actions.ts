'use server';
import { db } from '@/lib/mongo';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/auth';
import { uploadFilesToVercelBlob } from '../feeds/actions'; // Import shared function
import { ObjectId } from 'mongodb';
import { storySchema } from '@/lib/validations';

interface StoryDocument {
  _id: ObjectId;
  caption: string;
  files: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  userId?: string; // Changed to string
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Server action — handles form submissions from StoryDialog.
 * Signature matches form action type: (formData: FormData) => Promise<void>
 */
export async function createStoryAction(formData: FormData): Promise<void> {
  const data = {
    caption: (formData.get('caption') as string) || '',
    files: (formData.getAll('files') as File[]).filter(Boolean),
  };
  const validated = storySchema.parse(data);
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  const userId = session?.user?.id ?? undefined;

  const caption = (formData.get('caption') as string) || '';
  const files = (formData.getAll('files') as File[])?.filter(Boolean) || [];

  const uploaded = await uploadFilesToVercelBlob(files, userId);
  const doc = {
    caption: validated.caption,
    files: uploaded,
    userId: userId || undefined, // Changed to string
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
  await db.collection('stories').insertOne(doc);

  revalidatePath('/profile');

  return;
}

/**
 * Server read helper — still server-side (call from server components).
 */
export async function getStories(params: { userId?: string; page?: number; limit?: number; sortBy?: 1 | -1 } = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 50); // Increased default for stories UI
  const filter: Record<string, unknown> = {};
  if (params.userId) filter.userId = params.userId; // Changed to string
  // TEMP: Remove expiresAt filter to show all stories
  // filter.expiresAt = { $gt: new Date() };
  const collection = db.collection('stories');
  const total = await collection.countDocuments(filter);
  // Debug: Log filter and items found
  console.log('Stories Filter:', filter);
  // NEW: Aggregate to populate user data
  const items = await collection.aggregate([
    { $match: filter },
    { $lookup: { from: 'user', localField: 'userId', foreignField: '_id', as: 'user' } },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: params.sortBy || -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ])
    .toArray();
  console.log('Stories Items found:', items.length);
  // NEW: Normalize with populated user and userId for fallback
  const normalized = items.map((it) => ({
    _id: it._id.toString(),
    caption: it.caption,
    files: it.files,
    createdAt: it.createdAt.toISOString(),
    expiresAt: it.expiresAt.toISOString(),
    userId: it.userId?.toString(),
    user: it.user ? {
      id: it.user._id.toString(),
      name: it.user.name || 'Unknown',
      avatar: it.user.image || it.user.avatar || '/avatars/default.jpg',
      status: it.user.status || 'Online',
      category: it.user.category || 'Prieteni',
      email: it.user.email || '',
      provider: it.user.provider || 'credentials',
      createdAt: it.user.createdAt,
      updatedAt: it.user.updatedAt,
      location: it.user.location || [0, 0],
    } : null,
  }));

  return { items: normalized, total: normalized.length, hasMore: false };
}
