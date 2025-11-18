import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';
import ContClient from './ContClient';

export default async function Cont() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect('/profile');
  }
  return <ContClient />;
}
