'use server';

import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/mongo';
import { auth } from '@/lib/auth/auth';
import { User } from '@/lib/types';

type ProfileUpdateResponse = {
  success?: boolean;
  [k: string]: unknown;
};

type UserUpdate = {
  name?: string | null;
  image?: string | null;
  coverImage?: string | null;
  bio?: string | null;
  socials?: Record<string, string> | null;
  badges?: string[] | null;
  platforms?: string[] | null;
};

type Favorite = {
  userId: string;
  itemId: string;
  title: string;
  image: string;
  category: string;
  createdAt: Date;
  user: User | null;
};

export async function updateProfile(form: FormData): Promise<ProfileUpdateResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }
  const userId = session.user.id;

  const name = form.get('name')?.toString() || null;
  const imageUrl = form.get('imageUrl')?.toString() || null;
  const coverUrl = form.get('coverUrl')?.toString() || null;
  const bio = form.get('bio')?.toString() || null;
  const socialsRaw = form.get('socials')?.toString() || null;
  const badgesRaw = form.get('badges')?.toString() || null;
  const platformsRaw = form.get('platforms')?.toString() || null;

  try {
    const users = db.collection('user');
    const updateData: UserUpdate = {};
    if (name) updateData.name = name;
    if (imageUrl) updateData.image = imageUrl;
    if (coverUrl) updateData.coverImage = coverUrl;
    if (bio) updateData.bio = bio;
    if (socialsRaw) {
      try {
        updateData.socials = JSON.parse(socialsRaw);
      } catch {
        // ignore invalid socials format
      }
    }
    if (badgesRaw) {
      try {
        updateData.badges = JSON.parse(badgesRaw);
      } catch {
        // ignore invalid badges format
      }
    }
    if (platformsRaw) {
      try {
        updateData.platforms = JSON.parse(platformsRaw);
      } catch {
        // ignore invalid platforms format
      }
    }

    if (Object.keys(updateData).length > 0) {
      const result = await users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

      if (result.matchedCount === 0) {
        throw new Error('User not found');
      }
      revalidatePath(`/profile/${userId}`);
    }

    return { success: true };
  } catch (err) {
    throw err;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.collection('user').findOne({ _id: new ObjectId(id) });
    if (user) {
      return {
        _id: user._id.toString(),
        name: user.name || 'Unknown',
        image: user.image || '/avatars/01.jpg',
        coverImage: user.coverImage || '/placeholder.svg',
        bio: user.bio || '',
        socials: user.socials || {},
        badges: user.badges || [],
        platforms: user.platforms || [],
        status: user.status || 'Online',
        category: user.category || 'Prieteni',
        email: user.email || '',
        provider: user.provider || 'credentials',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        location: user.location || [0, 0],
        emailVerified: user.emailVerified,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function isFavorited(itemId: string): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    return false;
  }
  const userId = session.user.id;

  const favorites = db.collection('favorites');
  const existing = await favorites.findOne({ userId: new ObjectId(userId), itemId });
  return !!existing;
}

export async function toggleFavorite(
  itemId: string,
  itemTitle: string,
  itemImage: string,
  itemCategory: string
): Promise<{ success: boolean; isFavorited: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('You must be logged in to add to favorites!');
  }
  const userId = session.user.id;

  let userDetails = null;
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

  const favorites = db.collection('favorites');
  const existing = await favorites.findOne({ userId: new ObjectId(userId), itemId });

  if (existing) {
    await favorites.deleteOne({ _id: existing._id });
    revalidatePath('/');
    return { success: true, isFavorited: false };
  } else {
    await favorites.insertOne({
      userId: new ObjectId(userId),
      itemId,
      title: itemTitle,
      image: itemImage,
      category: itemCategory,
      user: userDetails,
      createdAt: new Date(),
    });
    revalidatePath('/');
    return { success: true, isFavorited: true };
  }
}

export async function getFavorites(): Promise<Favorite[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    return [];
  }
  const userId = session.user.id;

  const collection = db.collection('favorites');
  await collection.createIndex({ userId: 1 });
  const favorites = await collection.find({ userId: new ObjectId(userId) }).toArray();
  return favorites.map((fav) => ({
    userId: fav.userId.toString(),
    itemId: fav.itemId,
    title: fav.title,
    image: fav.image,
    category: fav.category,
    createdAt: fav.createdAt,
    user: fav.user || null,
  }));
}

export async function sendVerificationEmail(): Promise<{ success: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }

  try {
    await auth.api.sendVerificationEmail({
      body: {
        email: session.user.email,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function changePassword(formData: FormData): Promise<{ success: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!currentPassword || !newPassword) {
    throw new Error('Current password and new password are required');
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error('Failed to change password');
  }
}

export async function updatePrivacySettings(formData: FormData): Promise<{ success: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized: No valid session');
  }

  const userId = session.user.id;
  const emailPublic = formData.get('emailPublic') === 'true';
  const phonePublic = formData.get('phonePublic') === 'true';
  const locationPublic = formData.get('locationPublic') === 'true';
  const profileVisible = formData.get('profileVisible') === 'true';

  try {
    const users = db.collection('user');
    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          privacySettings: {
            emailPublic,
            phonePublic,
            locationPublic,
            profileVisible,
          },
          updatedAt: new Date(),
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    throw new Error('Failed to update privacy settings');
  }
}

export async function claimReward(rewardId: string): Promise<{ success: boolean; message: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.id) {
    throw new Error('Unauthorized');
  }
  const userId = session.user.id;

  try {
    const users = db.collection('user');
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error('User not found');
    }

    const currentBadges = user.badges || [];
    let newBadge: string | null = null;

    if (rewardId === 'verify-email') {
      if (!user.emailVerified) {
        throw new Error('Email not verified');
      }
      if (!currentBadges.includes('Email Verificat')) {
        newBadge = 'Email Verificat';
      } else {
        throw new Error('Reward already claimed');
      }
    } else if (rewardId === 'badge-social') {
      if (!currentBadges.includes('Social')) {
        newBadge = 'Social';
      } else {
        throw new Error('Reward already claimed');
      }
    } else {
      throw new Error('Invalid reward ID');
    }

    if (newBadge) {
      const updatedBadges = [...currentBadges, newBadge];
      await users.updateOne({ _id: new ObjectId(userId) }, { $set: { badges: updatedBadges } });
      revalidatePath('/profile');
      return { success: true, message: `Badge "${newBadge}" claimed successfully` };
    }

    return { success: false, message: 'No new badge to claim' };
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
}
