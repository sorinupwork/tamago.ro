import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ProfileClient from './ProfileClient';

export default async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <ProfileClient session={session} />;
}
