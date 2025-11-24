import { getUserById } from '@/actions/auth/actions';
import Image from 'next/image';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getUserById(id);

  if (!user) {
    return <div>User not found</div>;
  }

  // Minimal fallbacks
  const coverSrc = user.coverImage || '/default-cover.jpg';
  const avatarSrc = user.image || '/default-avatar.png';
  const locationText = Array.isArray(user.location) ? user.location.join(', ') : user.location || 'Unknown';

  const defaultPlatforms = ['Twitter', 'Instagram', 'TikTok', 'Netflix', 'Amazon'];
  const platforms = Array.isArray(user.platforms) && user.platforms.length > 0 ? user.platforms : defaultPlatforms;

  return (
    <div className='max-w-3xl mx-auto'>
      {/* Cover area */}
      <div className='relative h-56 w-full bg-muted overflow-hidden rounded-b-md'>
        <Image src={coverSrc} alt={`${user.name} cover`} fill style={{ objectFit: 'cover' }} priority />
        {/* Overlay gradient for readability */}
        <div className='absolute inset-0 card-overlay' />
      </div>

      {/* Header card overlapping the cover */}
      <div className='relative -mt-12 px-6'>
        <div className='bg-card/95 backdrop-blur rounded-lg shadow-md p-4 flex gap-4 items-center'>
          <div className='relative flex-shrink-0' style={{ width: 96, height: 96 }}>
            <Image src={avatarSrc} alt={user.name} width={96} height={96} className='rounded-full ring-2 ring-white' />
          </div>

          <div className='flex-1 min-w-0'>
            <h1 className='text-2xl font-semibold truncate'>{user.name || 'Unnamed'}</h1>
            <p className='text-sm text-muted-foreground truncate'>{user.status || 'No status'}</p>

            <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground'>
              <span>
                Category: <strong className='text-slate-800'>{user.category || 'n/a'}</strong>
              </span>
              <span className='hidden sm:inline'>·</span>
              <span>
                Location: <strong className='text-slate-800'>{locationText}</strong>
              </span>
              <span className='hidden sm:inline'>·</span>
              <span>
                Email: <strong className='text-slate-800'>{user.email || '—'}</strong>
              </span>
            </div>

            {/* Socials row */}
            <div className='mt-3 flex gap-2 flex-wrap'>
              {platforms.map((p) => {
                const key = p.toLowerCase();
                const href = (user.socials && user.socials[key]) || '#';
                const emoji =
                  p === 'Twitter'
                    ? '🐦'
                    : p === 'Instagram'
                      ? '📸'
                      : p === 'TikTok'
                        ? '🎵'
                        : p === 'Netflix'
                          ? '🎬'
                          : p === 'OnlyFans'
                            ? '⭐'
                            : p === 'Amazon'
                              ? '🛒'
                              : '🔗';

                return (
                  <a
                    key={p}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted hover:opacity-90 text-sm'
                  >
                    <span>{emoji}</span>
                    <span className='truncate max-w-[6rem]'>{p}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of profile content */}
      <div className='mt-6 px-6'>
        <section className='prose'>
          <h2>About</h2>
          <p>{user.bio || 'No bio yet.'}</p>
        </section>

        {/* other profile sections can go here */}
      </div>
    </div>
  );
}
