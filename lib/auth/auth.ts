import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

import { db } from '@/lib/mongo';
import { sendResetPasswordEmail } from '@/lib/auth/email';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 15 * 60,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendResetPasswordEmail({ user, url });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password reset for user ${user?.email}`);
    },
  },
  // TODO: Add socialProviders here if enabling social auth (e.g., google: { clientId: ..., clientSecret: ... })
  trustedOrigins: ['http://localhost:3000', 'https://tamago-six.vercel.app', 'https://tamago.ro'],
});
