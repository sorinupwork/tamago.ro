'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';
import { uploadFilesToVercelBlob } from '../feeds/actions';
import { storySchema } from '@/lib/validations';
import { ObjectId } from 'mongodb';

export async function createStoryAction(formData: FormData): Promise<void> {
  try {
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

    const uploaded = await uploadFilesToVercelBlob(files, userId, undefined, true);
    const doc = {
      caption: validated.caption,
      files: uploaded,
      userId: userId || undefined,
      user: userDetails,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      reactions: { likes: { total: 0, userIds: [] }, comments: [] },
    };
    const result = await db.collection('stories').insertOne(doc);
    if (!result.acknowledged) throw new Error('Failed to insert story');

    revalidatePath('/profile');
    revalidatePath('/social');
  } catch (error) {
    console.error('Error creating story:', error);
    throw new Error('Failed to create story');
  }
}

export async function getStories(params: { userId?: string; page?: number; limit?: number; sortBy?: 1 | -1 } = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 50);
  const filter: Record<string, unknown> = {};
  if (params.userId) filter.userId = params.userId;

  const collection = db.collection('stories');
  await collection.createIndex({ userId: 1 });
  const totalCount = await collection.countDocuments(filter);
  const items = await collection
    .find(filter)
    .sort({ createdAt: params.sortBy || -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  const normalized = items.map((it) => ({
    id: it._id.toString(),
    caption: it.caption,
    files: it.files,
    createdAt: it.createdAt.toISOString(),
    expiresAt: it.expiresAt.toISOString(),
    userId: it.userId?.toString(),
    user: it.user || null,
    reactions: it.reactions || { likes: { total: 0, userIds: [] }, comments: [] },
  }));

  const hasMore = page * limit < totalCount;
  return { items: normalized, total: totalCount, hasMore };
}

export async function updateStoryAction(storyId: string, formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const headersObj = await headers();
    const session = await auth.api.getSession({ headers: headersObj });
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' };
    }

    const collection = db.collection('stories');
    const story = await collection.findOne({ _id: new ObjectId(storyId) });

    if (!story) {
      return { success: false, message: 'Story not found' };
    }

    if (story.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized: You can only edit your own stories' };
    }

    const data = {
      caption: (formData.get('caption') as string) || '',
      files: (formData.getAll('files') as File[]).filter(Boolean),
    };

    const validated = storySchema.parse(data);

    const files = (formData.getAll('files') as File[]).filter(Boolean);
    let uploadedFiles = story.files || [];

    if (files.length > 0) {
      const newFiles = await uploadFilesToVercelBlob(files, session.user.id, storyId, true);
      uploadedFiles = newFiles;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(storyId) },
      {
        $set: {
          caption: validated.caption,
          files: uploadedFiles,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return { success: false, message: 'Failed to update story' };
    }

    revalidatePath('/profile');
    revalidatePath('/social');

    return { success: true, message: 'Story updated successfully' };
  } catch (error) {
    console.error('Error updating story:', error);
    return { success: false, message: 'An error occurred while updating the story' };
  }
}

export async function deleteStory(storyId: string): Promise<{ success: boolean; message: string }> {
  try {
    const headersObj = await headers();
    const session = await auth.api.getSession({ headers: headersObj });
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' };
    }

    const collection = db.collection('stories');
    const story = await collection.findOne({ _id: new ObjectId(storyId) });

    if (!story) {
      return { success: false, message: 'Story not found' };
    }

    if (story.userId !== session.user.id) {
      return { success: false, message: 'Unauthorized: You can only delete your own stories' };
    }

    const result = await collection.deleteOne({ _id: new ObjectId(storyId) });

    if (result.deletedCount === 0) {
      return { success: false, message: 'Failed to delete story' };
    }

    revalidatePath('/profile');
    revalidatePath('/social');

    return { success: true, message: 'Story deleted successfully' };
  } catch (error) {
    console.error('Error deleting story:', error);
    return { success: false, message: 'An error occurred while deleting the story' };
  }
}
