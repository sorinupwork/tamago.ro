'use server';

import { ObjectId } from 'mongodb';
import { db } from '@/lib/mongo'; // Import the db connection
import { auth } from '@/lib/auth/auth'; // Import auth for session
import { headers } from 'next/headers'; // For server action headers

type ProfileUpdatePayload = {
  name?: string | null;
  image?: string | null;
};

type ProfileUpdateResponse = {
  success?: boolean;
  [k: string]: unknown;
};

type UserUpdate = {
  name?: string | null;
  image?: string | null;
};

export async function updateProfile(form: FormData): Promise<ProfileUpdateResponse> {
  // Fetch session to get authenticated user ID securely
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }
  const userId = session.user.id; // Use session user ID instead of form data

  const name = form.get('name')?.toString() || null;
  const imageUrl = form.get('imageUrl')?.toString() || null; // Accept URL from form

  try {
    // Directly update the user in MongoDB using session user ID
    const users = db.collection('user'); // Changed to 'user' to match auth flow
    const updateData: UserUpdate = {};
    if (name) updateData.name = name;
    if (imageUrl) updateData.image = imageUrl; // Use provided URL

    if (Object.keys(updateData).length > 0) {
      const result = await users.updateOne(
        { _id: new ObjectId(userId) }, // Assuming userId is a string; convert to ObjectId
        { $set: updateData }
      );
      if (result.matchedCount === 0) {
        throw new Error('User not found');
      }
    }

    return { success: true };
  } catch (err) {
    // rethrow to client
    throw err;
  }
}
