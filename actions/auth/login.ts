'use server';

import { z } from 'zod';
import { loginSchema } from '@/lib/validations';

export async function loginAction(data: z.infer<typeof loginSchema>) {
  const validatedData = loginSchema.parse(data);
  return { success: true, data: validatedData };
}
