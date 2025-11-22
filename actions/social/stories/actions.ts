'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';
import { uploadFilesToVercelBlob } from '../feeds/actions';
import { storySchema } from '@/lib/validations';
import { ObjectId } from 'mongodb';

export async function createStoryAction(formData: FormData): Promise<void> {
  const data = {
    caption: (formData.get('caption') as string) || '',
    files: (formData.getAll('files') as File[]).filter(Boolean),
  };
  const validated = storySchema.parse(data);
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  const userId = session?.user?.id ?? undefined;

  let userDetails = null;
  if (userId) {
    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });
    if (user) {
      userDetails = {
        id: user._id.toString(),
        name: user.name || 'Unknown',
        avatar: user.image || '/avatars/default.jpg',
        status: user.status || 'Online',
        category: user.category || 'Prieteni',
        email: user.email || '',
        provider: user.provider || 'credentials',
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
        location: user.location || [0, 0],
      };
    }
  }

  const files = (formData.getAll('files') as File[])?.filter(Boolean) || [];

  const uploaded = await uploadFilesToVercelBlob(files, userId);
  const doc = {
    caption: validated.caption,
    files: uploaded,
    userId: userId || undefined,
    user: userDetails, // Embed user details
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    reactions: { likes: { total: 0, userIds: [] }, comments: [] },
  };
  await db.collection('stories').insertOne(doc);

  revalidatePath('/profile');

  return;
}

export async function getStories(params: { userId?: string; page?: number; limit?: number; sortBy?: 1 | -1 } = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 50);
  const filter: Record<string, unknown> = {};
  if (params.userId) filter.userId = params.userId;

  const collection = db.collection('stories');
  await collection.createIndex({ userId: 1 });
  await collection.countDocuments(filter);
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
    userId: it.userId?.toString(),
    user: it.user || null,
    reactions: it.reactions || { likes: { total: 0, userIds: [] }, comments: [] },
  }));

  return { items: normalized, total: normalized.length, hasMore: false };
}
