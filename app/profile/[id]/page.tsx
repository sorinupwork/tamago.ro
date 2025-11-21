import { getUserById } from '@/actions/auth/actions';
import Image from 'next/image';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getUserById(id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <Image src={user.image} alt={user.name} width={100} height={100} />
      <p>Status: {user.status}</p>
      <p>Category: {user.category}</p>
      <p>Email: {user.email}</p>
      <p>Location: {user.location.join(', ')}</p>
    </div>
  );
}
