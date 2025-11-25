import { Resend } from 'resend';

import { ResetPasswordEmail } from '@/components/custom/email/ResetPasswordEmail';
import { VerifyEmail } from '@/components/custom/email/VerifyEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail({ user, url }: { user: { email: string }; url: string }) {
  await resend.emails.send({
    from: 'noreply@madam.blog',
    to: user.email,
    subject: 'Resetează-ți Parola',
    react: ResetPasswordEmail({ resetUrl: url }),
  });
}

export async function sendVerificationEmail({ user, url }: { user: { email: string }; url: string }) {
  await resend.emails.send({
    from: 'noreply@madam.blog',
    to: user.email,
    subject: 'Verifică-ți Email-ul - Tamago',
    react: VerifyEmail({ verificationUrl: url }),
  });
}
