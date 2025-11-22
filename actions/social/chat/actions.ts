'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';
import { User } from '@/lib/types';

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

type DBUserDoc = {
  _id: ObjectId;
  name?: string | null;
  image?: string | null;
  status?: string | null;
  category?: string | null;
  email?: string | null;
  provider?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  location?: [number, number] | null;
};

export async function getAllUsers({ excludeCurrent = false } = {}): Promise<{ users: User[]; currentUserId?: string | null }> {
  const headersObj = await headers();
  const session = await auth.api.getSession({ headers: headersObj });
  const currentUserId = session?.user?.id ?? null;

  const collection = db.collection('user');
  await collection.createIndex({ _id: 1 });
  const rows = await collection.find<DBUserDoc>({}).toArray();

  const normalized = rows.map((u: DBUserDoc) => ({
    id: u._id.toString(),
    name: u.name || 'Unknown',
    avatar: u.image || '/avatars/01.jpg',
    status: u.status || 'Offline',
    category: u.category || 'Prieteni',
    email: u.email || '',
    provider: u.provider || 'credentials',
    createdAt: u.createdAt ?? undefined,
    updatedAt: u.updatedAt ?? undefined,
    location: u.location || null,
  })) as User[];

  const users = excludeCurrent && currentUserId ? normalized.filter((x) => x.id !== currentUserId) : normalized;
  return { users, currentUserId };
}
