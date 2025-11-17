'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import { signupSchema } from '@/lib/validations';
import { db } from '@/lib/mongo';

export async function signupAction(data: z.infer<typeof signupSchema>) {
  const validatedData = signupSchema.parse(data);
  const existingUser = await db.collection('users').findOne({ email: validatedData.email });
  if (existingUser) throw new Error('User already exists');
  const hashedPassword = await hash(validatedData.password, 12);
  const user = {
    name: validatedData.name,
    email: validatedData.email,
    password: hashedPassword,
    provider: 'credentials',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.collection('users').insertOne(user);
  return { success: true, message: 'User created' };
}
