'use server';

import { put } from '@vercel/blob';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb'; // Added for type safety

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';
import { feedSchema, pollSchema } from '@/lib/validations';

type FileLike = File | Blob;

interface PostDocument {
  _id: ObjectId;
  type: 'post';
  text: string;
  files: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  userId?: string; // Changed to string
  createdAt: Date;
  tags: string[];
}

interface PollDocument {
  _id: ObjectId;
  type: 'poll';
  question: string;
  options: string[];
  userId?: string; // Changed to string
  createdAt: Date;
}

type FeedDocument = PostDocument | PollDocument;

export async function uploadFilesToVercelBlob(files?: FileLike[], userId?: string, postId?: string) {
  if (!files || files.length === 0) return [];
  const uploaded: { url: string; key: string; filename: string; contentType?: string; size: number }[] = [];
  const getSubfolder = (file: FileLike) => {
    const type = (file as File).type || '';
    if (type.startsWith('image/')) return `feed_images`;
    if (type.startsWith('video/')) return `feed_videos`;
    return `feed_documents`;
  };
  for (const file of files) {
    const buffer = Buffer.from(await (file as File).arrayBuffer());
    const filename = `${Date.now()}-${(file as File).name ?? 'file'}`;
    const subfolder = getSubfolder(file);
    const postSegment = postId ? `post_${postId}/` : '';
    const key = `user/${userId ?? 'anonymous'}/${postSegment}${subfolder}/${filename}`;
    const blob = await put(key, buffer, { access: 'public' });
    uploaded.push({ url: blob.url, key, filename, contentType: (file as File).type || undefined, size: buffer.length });
  }
  return uploaded;
}

export async function createFeedAction(formData: FormData): Promise<void> {
  const data = {
    text: (formData.get('text') as string) || '',
    files: (formData.getAll('files') as File[]).filter(Boolean),
    tags: (formData.getAll('tags') as string[]).filter(Boolean),
  };
  const validated = feedSchema.parse(data);

  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  const userId = session?.user?.id ?? undefined;

  const files = (formData.getAll('files') as File[])?.filter(Boolean) || [];
  const uploaded = await uploadFilesToVercelBlob(files, userId);
  const doc: PostDocument = {
    _id: new ObjectId(),
    type: 'post',
    text: validated.text || '',
    files: uploaded,
    tags: validated.tags || [],
    userId: userId || undefined, // Changed to string
    createdAt: new Date(),
  };
  await db.collection('feeds').insertOne(doc);

  revalidatePath('/profile');

  return;
}

export async function createPollAction(formData: FormData): Promise<void> {
  const data = {
    question: (formData.get('question') as string) || '',
    options: (formData.getAll('options') as string[]).filter(Boolean),
  };
  const validated = pollSchema.parse(data);

  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  const userId = session?.user?.id ?? undefined;

  const doc: PollDocument = {
    _id: new ObjectId(),
    type: 'poll',
    question: validated.question,
    options: validated.options.map((o) => o.value),
    userId: userId || undefined, // Changed to string
    createdAt: new Date(),
  };
  await db.collection('feeds').insertOne(doc);

  revalidatePath('/profile');

  return;
}

export async function getFeedPosts(params: { userId?: string; page?: number; limit?: number; type?: string; sortBy?: 1 | -1 } = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 20); // Default for feeds UI
  const filter: Record<string, unknown> = {};
  if (params.userId) filter.userId = params.userId; // Changed to string
  if (params.type) filter.type = params.type;
  const collection = db.collection('feeds');
  const total = await collection.countDocuments(filter);
  // Debug: Log filter and items found
  console.log('FeedPosts Filter:', filter);
  // NEW: Aggregate to populate user data
  const items = await collection.aggregate([
    { $match: filter },
    { $lookup: { from: 'user', localField: 'userId', foreignField: '_id', as: 'user' } },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: params.sortBy || -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ]).toArray();
  console.log('FeedPosts Items found:', items.length);
  // NEW: Normalize with populated user, userId for fallback, and type-specific fields
  const normalized = items.map((it) => ({
    _id: it._id.toString(),
    type: it.type,
    userId: it.userId?.toString(),
    ...(it.type === 'post' ? { text: it.text, tags: it.tags, files: it.files } : { question: it.question, options: it.options }),
    createdAt: it.createdAt.toISOString(),
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

export async function getPolls(params: { userId?: string; page?: number; limit?: number } = {}) {
  return getFeedPosts({ ...params, type: 'poll' });
}

export async function getStories(params: { userId?: string; page?: number; limit?: number; sortBy?: 1 | -1 } = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 20);
  const filter: Record<string, unknown> = {};
  if (params.userId) filter.userId = params.userId; // Changed to string
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
