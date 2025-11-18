import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import ProfileClient from './ProfileClient';

export default async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/cont');
  }
  return <ProfileClient session={session} />;
}
