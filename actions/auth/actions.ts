'use server';

import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';

type ProfileUpdateResponse = {
  success?: boolean;
  [k: string]: unknown;
};

type UserUpdate = {
  name?: string | null;
  image?: string | null;
};

export async function updateProfile(form: FormData): Promise<ProfileUpdateResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }
  const userId = session.user.id;

  const name = form.get('name')?.toString() || null;
  const imageUrl = form.get('imageUrl')?.toString() || null;

  try {
    const users = db.collection('user');
    const updateData: UserUpdate = {};
    if (name) updateData.name = name;
    if (imageUrl) updateData.image = imageUrl;

    if (Object.keys(updateData).length > 0) {
      const result = await users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
      if (result.matchedCount === 0) {
        throw new Error('User not found');
      }
    }

    return { success: true };
  } catch (err) {
    throw err;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.collection('user').findOne({ _id: new ObjectId(id) });
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
