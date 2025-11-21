'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';
import { uploadFilesToVercelBlob } from '../feeds/actions';
import { storySchema } from '@/lib/validations';

export async function createStoryAction(formData: FormData): Promise<void> {
  const data = {
    caption: (formData.get('caption') as string) || '',
    files: (formData.getAll('files') as File[]).filter(Boolean),
  };
  const validated = storySchema.parse(data);
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  const userId = session?.user?.id ?? undefined;

  const files = (formData.getAll('files') as File[])?.filter(Boolean) || [];

  const uploaded = await uploadFilesToVercelBlob(files, userId);
  const doc = {
    caption: validated.caption,
    files: uploaded,
    userId: userId || undefined,
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
  await collection.countDocuments(filter);
  const items = await collection
    .aggregate([
      { $match: filter },
      { $lookup: { from: 'user', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: params.sortBy || -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ])
    .toArray();
  const normalized = items.map((it) => ({
    _id: it._id.toString(),
    caption: it.caption,
    files: it.files,
    createdAt: it.createdAt.toISOString(),
    expiresAt: it.expiresAt.toISOString(),
    userId: it.userId?.toString(),
    user: it.user
      ? {
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
        }
      : null,
    reactions: it.reactions || { likes: { total: 0, userIds: [] }, comments: [] },
  }));

  return { items: normalized, total: normalized.length, hasMore: false };
}
