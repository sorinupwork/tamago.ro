'use server';

import { put } from '@vercel/blob';
import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ObjectId } from 'mongodb';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

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
  user: {
    id: string;
    name: string;
    avatar: string;
    status: string;
    category: string;
    email: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    location: [number, number];
  } | null;
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
  user: {
    id: string;
    name: string;
    avatar: string;
    status: string;
    category: string;
    email: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    location: [number, number];
  } | null;
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

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export async function uploadFilesToVercelBlob(files?: FileLike[], userId?: string, postId?: string, generateVideoPreview = false) {
  if (!files || files.length === 0) return [];
  const uploaded: { url: string; key: string; filename: string; contentType?: string; size: number; thumbnailUrl?: string }[] = [];
  const getSubfolder = (file: FileLike) => {
    const type = (file as File).type || '';
    if (type.startsWith('image/')) return `feed_images`;
    if (type.startsWith('video/')) return `feed_videos`;
    return `feed_documents`;
  };

  function hasSizeProp(obj: unknown): obj is { size: number } {
    return typeof obj === 'object' && obj !== null && 'size' in obj && typeof (obj as { size?: unknown }).size === 'number';
  }

  function getSizeFromBody(body: unknown): number | undefined {
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) return (body as Buffer).length;
    if (body instanceof ArrayBuffer) return body.byteLength;
    if (ArrayBuffer.isView(body)) return (body as ArrayBufferView).byteLength;
    if (hasSizeProp(body)) return body.size;
    return undefined;
  }

  type PutOptions = NonNullable<Parameters<typeof put>[2]>;
  type PutResult = Awaited<ReturnType<typeof put>>;

  for (const file of files) {
    const buffer = Buffer.from(await (file as File).arrayBuffer());
    const filename = `${Date.now()}-${(file as File).name ?? 'file'}`;
    const subfolder = getSubfolder(file);
    const postSegment = postId ? `post_${postId}/` : '';
    const key = `user/${userId ?? 'anonymous'}/${postSegment}${subfolder}/${filename}`;

    const size = getSizeFromBody(buffer);

    const putOptions: PutOptions = {
      access: 'public',
      ...(file.type ? { contentType: file.type } : {}),
      ...(typeof size === 'number' ? { contentLength: size } : {}),
    };

    try {
      const blob: PutResult = await put(key, buffer, putOptions);

      const fileObj: { url: string; key: string; filename: string; contentType?: string; size: number; thumbnailUrl?: string } = {
        url: blob.url,
        key,
        filename,
        contentType: (file as File).type || undefined,
        size: buffer.length,
      };

      try {
        const type = (file as File).type || '';
        if (generateVideoPreview && type.startsWith('video/')) {
          const tmpInput = path.join(os.tmpdir(), `upload-${Date.now()}-${filename}`);
          const tmpThumb = `${tmpInput}-thumb.png`;
          await fs.writeFile(tmpInput, buffer);
          await new Promise<void>((resolve, reject) => {
            ffmpeg(tmpInput)
              .screenshots({
                timestamps: ['50%'],
                filename: path.basename(tmpThumb),
                folder: path.dirname(tmpThumb),
                size: '640x?',
              })
              .on('end', () => resolve())
              .on('error', (err) => reject(err));
          });
          const thumbBuffer = await fs.readFile(tmpThumb);
          const thumbName = `thumb-${filename.replace(/\.[^/.]+$/, '')}.png`;
          const thumbKey = `user/${userId ?? 'anonymous'}/${postSegment}${subfolder}/${thumbName}`;
          const thumbOptions: PutOptions = {
            access: 'public',
            ...(typeof thumbBuffer.length === 'number' ? { contentLength: thumbBuffer.length } : {}),
            contentType: 'image/png',
          };
          const thumbBlob: PutResult = await put(thumbKey, thumbBuffer, thumbOptions);
          fileObj.thumbnailUrl = thumbBlob.url;

          await fs.unlink(tmpInput).catch(() => {});
          await fs.unlink(tmpThumb).catch(() => {});
        }
      } catch (err) {
        console.error('Error generating thumbnail:', err);
      }

      uploaded.push(fileObj);
    } catch (err) {
      console.error('Error uploading file to Vercel Blob', {
        key,
        filename,
        size,
        error: err,
      });
      throw err;
    }
  }
  return uploaded;
}

export async function createFeedAction(formData: FormData): Promise<void> {
  try {
    const data = {
      text: (formData.get('text') as string) || '',
      files: (formData.getAll('files') as File[]).filter(Boolean),
      tags: (formData.getAll('tags') as string[]).filter(Boolean),
    };
    const validated = feedSchema.parse(data);

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
          avatar: user.image || '/avatars/01.jpg',
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
    const doc: PostDocument = {
      _id: new ObjectId(),
      type: 'post',
      text: validated.text || '',
      files: uploaded,
      tags: validated.tags || [],
      userId: userId || undefined,
      user: userDetails,
      createdAt: new Date(),
      reactions: { likes: { total: 0, userIds: [] }, comments: [] },
    };
    const result = await db.collection('feeds').insertOne(doc);
    if (!result.acknowledged) throw new Error('Failed to insert feed');

    revalidatePath('/profile');
    revalidatePath('/social');
  } catch (error) {
    console.error('Error creating feed:', error);
    throw new Error('Failed to create feed');
  }
}

export async function createPollAction(formData: FormData): Promise<void> {
  const data = {
    question: (formData.get('question') as string) || '',
    options: (formData.getAll('options') as string[]).filter(Boolean).map((value) => ({ value })),
  };
  const validated = pollSchema.parse(data);

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
        avatar: user.image || '/avatars/01.jpg',
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

  const doc: PollDocument = {
    _id: new ObjectId(),
    type: 'poll',
    question: validated.question,
    options: validated.options.map((o) => o.value),
    votes: validated.options.map(() => 0),
    votedUsers: [],
    userId: userId || undefined,
    user: userDetails,
    createdAt: new Date(),
    reactions: { likes: { total: 0, userIds: [] }, comments: [] },
  };
  await db.collection('feeds').insertOne(doc);

  revalidatePath('/profile');
  revalidatePath('/social');

  return;
}

export async function getFeedPosts(
  params: { userId?: string; page?: number; limit?: number; type?: string; sortBy?: 1 | -1; tags?: string[]; search?: string } = {}
) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 20);
  const filter: Record<string, unknown> = {};
  if (params.userId) filter.userId = params.userId;
  if (params.type && params.type !== 'both') filter.type = params.type;

  // Add search filter if search query provided
  if (params.search) {
    const searchRegex = new RegExp(params.search, 'i');
    filter.$or = [{ text: { $regex: searchRegex } }, { question: { $regex: searchRegex } }, { tags: { $in: [searchRegex] } }];
  }

  const collection = db.collection('feeds');
  await collection.createIndex({ userId: 1 });
  const totalCount = await collection.countDocuments(filter);
  const items = await collection
    .find(filter)
    .sort({ createdAt: params.sortBy || -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  let normalized = items.map((it) => {
    const base = {
      id: it._id.toString(),
      type: it.type,
      userId: it.userId?.toString(),
      createdAt: it.createdAt.toISOString(),
      user: it.user || null,
      reactions: it.reactions || { likes: { total: 0, userIds: [] }, comments: [] },
      tags: it.tags || [],
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

  if (params.tags && params.tags.length > 0) {
    normalized = normalized.filter((item) => item.tags && item.tags.some((tag: string) => params.tags!.includes(tag)));
  }

  const hasMore = page * limit < totalCount;
  return { items: normalized, total: totalCount, hasMore };
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
  revalidatePath('/profile');
  try {
    revalidateTag('feeds', {});
    revalidateTag('social', {});
  } catch {}
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
  if (itemType === 'story' && reactions.comments.length >= 1) {
    throw new Error('Maximum one comment allowed per story');
  }
  const id = Date.now().toString();
  reactions.comments.push({ id, text, userId, createdAt: new Date(), replies: [] });
  await collection.updateOne({ _id: new ObjectId(itemId) }, { $set: { reactions } });
  revalidatePath('/social');
  revalidatePath('/profile');
  try {
    revalidateTag('feeds', {});
    revalidateTag('stories', {});
  } catch {}
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
  revalidatePath('/profile');
  try {
    revalidateTag('feeds', {});
    revalidateTag('stories', {});
  } catch {}
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
  revalidatePath('/profile');
  try {
    revalidateTag('feeds', {});
  } catch {}
}

export async function updateFeedPost(feedId: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const headersObj = await headers();
    const session = await auth.api.getSession({ headers: headersObj });
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' };
    }

    const collection = db.collection('feeds');
    const post = await collection.findOne({ _id: new ObjectId(feedId) });

    if (!post) {
      return { success: false, message: 'Feed post not found' };
    }

    if (post.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized: You can only edit your own posts' };
    }

    const data = {
      text: (formData.get('text') as string) || '',
      files: (formData.getAll('files') as File[]).filter(Boolean),
      tags: (formData.getAll('tags') as string[]).filter(Boolean),
    };

    const validated = feedSchema.parse(data);

    const files = (formData.getAll('files') as File[]).filter(Boolean);
    let uploadedFiles = post.files || [];

    if (files.length > 0) {
      const newFiles = await uploadFilesToVercelBlob(files, session.user.id, feedId);
      uploadedFiles = newFiles;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(feedId) },
      {
        $set: {
          text: validated.text,
          files: uploadedFiles,
          tags: validated.tags || [],
        },
      }
    );

    if (result.modifiedCount === 0) {
      return { success: false, message: 'Failed to update feed post' };
    }

    revalidatePath('/profile');
    revalidatePath('/social');

    return { success: true, message: 'Feed post updated successfully' };
  } catch (error) {
    console.error('Error updating feed post:', error);
    return { success: false, message: 'An error occurred while updating the feed post' };
  }
}

export async function updatePollPost(pollId: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const headersObj = await headers();
    const session = await auth.api.getSession({ headers: headersObj });
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' };
    }

    const collection = db.collection('feeds');
    const poll = await collection.findOne({ _id: new ObjectId(pollId), type: 'poll' });

    if (!poll) {
      return { success: false, message: 'Poll not found' };
    }

    if (poll.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized: You can only edit your own polls' };
    }

    const data = {
      question: (formData.get('question') as string) || '',
      options: (formData.getAll('options') as string[]).filter(Boolean).map((value) => ({ value })),
    };

    const validated = pollSchema.parse(data);

    const result = await collection.updateOne(
      { _id: new ObjectId(pollId) },
      {
        $set: {
          question: validated.question,
          options: validated.options.map((o) => o.value),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return { success: false, message: 'Failed to update poll' };
    }

    revalidatePath('/profile');
    revalidatePath('/social');

    return { success: true, message: 'Poll updated successfully' };
  } catch (error) {
    console.error('Error updating poll:', error);
    return { success: false, message: 'An error occurred while updating the poll' };
  }
}

export async function deleteFeedPost(feedId: string): Promise<{ success: boolean; message: string }> {
  try {
    const headersObj = await headers();
    const session = await auth.api.getSession({ headers: headersObj });
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' };
    }

    const collection = db.collection('feeds');
    const post = await collection.findOne({ _id: new ObjectId(feedId) });

    if (!post) {
      return { success: false, message: 'Feed post not found' };
    }

    if (post.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized: You can only delete your own posts' };
    }

    const result = await collection.deleteOne({ _id: new ObjectId(feedId) });

    if (result.deletedCount === 0) {
      return { success: false, message: 'Failed to delete feed post' };
    }

    revalidatePath('/profile');
    revalidatePath('/social');

    return { success: true, message: 'Feed post deleted successfully' };
  } catch (error) {
    console.error('Error deleting feed post:', error);
    return { success: false, message: 'An error occurred while deleting the feed post' };
  }
}
