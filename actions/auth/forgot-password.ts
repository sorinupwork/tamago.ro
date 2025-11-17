'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import crypto from 'crypto';
import { db } from '@/lib/mongo';

const resend = new Resend(process.env.RESEND_API_KEY);

const forgotPasswordSchema = z.object({
  email: z.string(),
});

export async function forgotPasswordAction(data: z.infer<typeof forgotPasswordSchema>) {
  const validatedData = forgotPasswordSchema.parse(data);
  const user = await db.collection('users').findOne({ email: validatedData.email });
  if (!user) throw new Error('User not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour

  await db.collection('users').updateOne({ _id: user._id }, { $set: { resetToken, resetTokenExpiry } });

  const resetUrl = `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: 'noreply@tamago.com',
    to: validatedData.email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });

  return { success: true, message: 'Reset email sent' };
}
