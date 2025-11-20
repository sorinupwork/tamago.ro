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
  userId?: string;
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
    userId,
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
  const limit = Math.max(1, params.limit || 20);
  const filter: Record<string, unknown> = {};
  if (params.userId) filter.userId = params.userId;
  filter.expiresAt = { $gt: new Date() };
  const collection = db.collection('stories');
  const total = await collection.countDocuments(filter);
  const items = await collection
    .find(filter)
    .sort({ createdAt: params.sortBy || -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  const normalized = items.map((it) => ({
    _id: it._id.toString(),
    caption: it.caption,
    files: it.files,
    createdAt: it.createdAt.toISOString(),
    expiresAt: it.expiresAt.toISOString(),
  }));
  return { items: normalized, total, hasMore: page * limit < total };
}
