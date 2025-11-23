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
  // pick a preview image: prefer thumbnailUrl from any file, then first image url
  const storyPreview: string | undefined = (() => {
    if (!hasStories) return undefined;
    // iterate over typed file objects (StoryWithUser.files[number])
    for (const s of userStories) {
      for (const f of s.files) {
        if (f.thumbnailUrl) return f.thumbnailUrl;
      }
    }
    for (const s of userStories) {
      for (const f of s.files) {
        if (f.contentType?.startsWith?.('image/')) return f.url;
      }
    }
    // no image preview available
    return undefined;
  })();

  const handleClick = () => {
    if (hasStories) {
      setSelectedStory({ userId: user?.id || '', index: 0 });
    }
  };

  return (
    <>
      <div className='flex flex-col items-center gap-2 hover:scale-105 transition-transform shrink-0 cursor-pointer' onClick={handleClick}>
        <UserProfileCard user={user} interactive={!hasStories} size='md' storyPreview={storyPreview} showName />
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
