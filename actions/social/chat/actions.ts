'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';

type MessageDoc = {
  _id: ObjectId;
  fromUserId: string;
  toUserId: string;
  text: string;
  createdAt: Date;
};

export async function sendMessage(toUserId: string, text: string): Promise<void> {
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  if (!session?.user?.id) throw new Error('Not authenticated');
  const fromUserId = session.user.id;

  const doc: MessageDoc = {
    _id: new ObjectId(),
    fromUserId,
    toUserId,
    text,
    createdAt: new Date(),
  };
  await db.collection('messages').insertOne(doc);

  revalidatePath('/social');
}

export async function getMessages(toUserId: string): Promise<{ id: string; text: string; sender: 'me' | 'other'; createdAt: string }[]> {
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  if (!session?.user?.id) throw new Error('Not authenticated');
  const fromUserId = session.user.id;

  const collection = db.collection('messages');
  await collection.createIndex({ fromUserId: 1, toUserId: 1, createdAt: 1 }); // Indexes for efficient queries
  const messages = await collection
    .find({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    })
    .sort({ createdAt: 1 })
    .toArray();

  return messages.map((msg) => ({
    id: msg._id.toString(),
    text: msg.text,
    sender: msg.fromUserId === fromUserId ? 'me' : 'other',
    createdAt: msg.createdAt.toISOString(),
  }));
}