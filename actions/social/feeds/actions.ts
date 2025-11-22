'use server';

import { put } from '@vercel/blob';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';
import { feedSchema, pollSchema } from '@/lib/validations';

type FileLike = File | Blob;

type PostDocument = {
  _id: ObjectId;
  type: 'post';
  text: string;
  files: { url: string; key: string; filename: string; contentType?: string; size: number }[];
  userId?: string;
  createdAt: Date;
  tags: string[];
  reactions: {
    likes: { total: number; userIds: string[] };
    comments: {
      id: string;
      text: string;
      userId: string;
      createdAt: Date;
      replies: { id: string; text: string; userId: string; createdAt: Date }[];
    }[];
  };
};

type PollDocument = {
  _id: ObjectId;
  type: 'poll';
  question: string;
  options: string[];
  votes: number[];
  votedUsers: string[];
  userId?: string;
  createdAt: Date;
  reactions: {
    likes: { total: number; userIds: string[] };
    comments: {
      id: string;
      text: string;
      userId: string;
      createdAt: Date;
      replies: { id: string; text: string; userId: string; createdAt: Date }[];
    }[];
  };
};

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
    userId: userId || undefined,
    createdAt: new Date(),
    reactions: { likes: { total: 0, userIds: [] }, comments: [] },
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
    votes: validated.options.map(() => 0),
    votedUsers: [],
    userId: userId || undefined,
    createdAt: new Date(),
    reactions: { likes: { total: 0, userIds: [] }, comments: [] },
  };
  await db.collection('feeds').insertOne(doc);

  revalidatePath('/profile');

  return;
}

export async function getFeedPosts(params: { userId?: string; page?: number; limit?: number; type?: string; sortBy?: 1 | -1 } = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 20);
  const filter: Record<string, unknown> = {};
  if (params.userId) filter.userId = params.userId;
  if (params.type) filter.type = params.type;
  const collection = db.collection('feeds');
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

  const normalized = items.map((it) => {
    const base = {
      _id: it._id.toString(),
      type: it.type,
      userId: it.userId?.toString(),
      createdAt: it.createdAt.toISOString(),
      user: it.user
        ? {
            id: it.user._id.toString(),
            name: it.user.name || 'Unknown',
            avatar: it.user.image || '/avatars/01.jpg',
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
    };
    if (it.type === 'post') {
      return { ...base, text: it.text, tags: it.tags, files: it.files };
    } else {
      return {
        ...base,
        question: it.question,
        options: it.options,
        votes: it.votes || it.options.map(() => 0),
        votedUsers: it.votedUsers || [],
      };
    }
  });

  return { items: normalized, total: normalized.length, hasMore: false };
}

export async function getPolls(params: { userId?: string; page?: number; limit?: number } = {}) {
  return getFeedPosts({ ...params, type: 'poll' });
}

export async function addLikeAction(itemId: string, itemType: 'feed' | 'story'): Promise<void> {
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  if (!session?.user?.id) throw new Error('Not authenticated');
  const userId = session.user.id;
  const collection = itemType === 'feed' ? db.collection('feeds') : db.collection('stories');
  const item = await collection.findOne({ _id: new ObjectId(itemId) });
  if (!item) throw new Error('Item not found');
  const reactions = item.reactions || { likes: { total: 0, userIds: [] }, comments: [] };
  const hasLiked = reactions.likes.userIds.includes(userId);
  if (hasLiked) {
    reactions.likes.total -= 1;
    reactions.likes.userIds = reactions.likes.userIds.filter((id: string) => id !== userId);
  } else {
    reactions.likes.total += 1;
    reactions.likes.userIds.push(userId);
  }
  await collection.updateOne({ _id: new ObjectId(itemId) }, { $set: { reactions } });
  revalidatePath('/social');
}

export async function addCommentAction(itemId: string, text: string, itemType: 'feed' | 'story'): Promise<void> {
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  if (!session?.user?.id) throw new Error('Not authenticated');
  const userId = session.user.id;
  const collection = itemType === 'feed' ? db.collection('feeds') : db.collection('stories');
  const item = await collection.findOne({ _id: new ObjectId(itemId) });
  if (!item) throw new Error('Item not found');
  const reactions = item.reactions || { likes: { total: 0, userIds: [] }, comments: [] };
  if (itemType === 'story' && reactions.comments.length >= 1) throw new Error('Stories allow max 1 comment');
  const id = Date.now().toString();
  reactions.comments.push({ id, text, userId, createdAt: new Date(), replies: [] });
  await collection.updateOne({ _id: new ObjectId(itemId) }, { $set: { reactions } });
  revalidatePath('/social');
}

export async function addReplyAction(itemId: string, commentId: string, text: string, itemType: 'feed' | 'story'): Promise<void> {
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  if (!session?.user?.id) throw new Error('Not authenticated');
  const userId = session.user.id;
  const collection = itemType === 'feed' ? db.collection('feeds') : db.collection('stories');
  const item = await collection.findOne({ _id: new ObjectId(itemId) });
  if (!item) throw new Error('Item not found');
  const reactions = item.reactions || { likes: { total: 0, userIds: [] }, comments: [] };
  const comment = reactions.comments.find((c: { id: string }) => c.id === commentId);
  if (!comment) throw new Error('Comment not found');
  if (itemType === 'story' && comment.replies.length >= 1) throw new Error('Stories allow max 1 reply per comment');
  const replyId = Date.now().toString(); 
  comment.replies.push({ id: replyId, text, userId, createdAt: new Date() });
  await collection.updateOne({ _id: new ObjectId(itemId) }, { $set: { reactions } });
  revalidatePath('/social');
}

export async function voteOnPollAction(pollId: string, optionIndex: number): Promise<void> {
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  if (!session?.user?.id) throw new Error('Not authenticated');
  const userId = session.user.id;
  const collection = db.collection('feeds');
  const poll = await collection.findOne({ _id: new ObjectId(pollId), type: 'poll' });
  if (!poll) throw new Error('Poll not found');
  if (!poll.votes) poll.votes = poll.options.map(() => 0);
  if (!poll.votedUsers) poll.votedUsers = [];
  if (poll.votedUsers.includes(userId)) throw new Error('Already voted');
  if (optionIndex < 0 || optionIndex >= poll.votes.length) throw new Error('Invalid option');
  poll.votes[optionIndex] += 1;
  poll.votedUsers.push(userId);
  await collection.updateOne({ _id: new ObjectId(pollId) }, { $set: { votes: poll.votes, votedUsers: poll.votedUsers } });
  revalidatePath('/social');
}
