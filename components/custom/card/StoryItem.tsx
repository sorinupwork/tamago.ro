'use client';

import { useState } from 'react';
import { StoryWithUser, User } from '@/lib/types';
import UserProfileCard from './UserProfileCard';
import { StoryViewer } from '../media/StoryViewer';

type StoryItemProps = {
  user: User | null;
  stories: StoryWithUser[];
};

export default function StoryItem({ user, stories }: StoryItemProps) {
  const [selectedStory, setSelectedStory] = useState<{ userId: string; index: number } | null>(null);

  const userStories = stories.filter((story) => story.user?.id === user?.id);
  const hasStories = userStories.length > 0;

  const handleClick = () => {
    if (hasStories) {
      setSelectedStory({ userId: user?.id || '', index: 0 });
    }
  };

  return (
    <>
      <div className='flex flex-col items-center gap-2 hover:scale-105 transition-transform shrink-0 cursor-pointer' onClick={handleClick}>
        <UserProfileCard user={user} interactive={!hasStories} size='md' />
        <span className='text-xs'>{user?.name || 'Unknown'}</span>
      </div>

      {selectedStory && (
        <StoryViewer
          key={selectedStory.userId + '-' + selectedStory.index}
          stories={stories}
          userId={selectedStory.userId}
          initialIndex={selectedStory.index}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  );
}
