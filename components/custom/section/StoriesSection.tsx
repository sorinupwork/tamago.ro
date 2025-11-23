import { Camera } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { User } from '@/lib/types';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '../empty/Empty';
import { getStories } from '@/actions/social/stories/actions';
import StoryItem from '@/components/custom/card/StoryItem';

type StoriesSectionProps = {
  mode?: 'stories' | 'users';
  title?: string;
  users?: User[];
  limit?: number;
};

// Server-only async component
export default async function StoriesSection({ mode = 'stories', title = 'Stories', users = [], limit = 50 }: StoriesSectionProps) {
  const isStoriesMode = mode === 'stories';
  const stories = isStoriesMode ? (await getStories({ limit })).items : [];

  // Collect unique users (stories mode) or use supplied users (users mode).
  const uniqueUsers: User[] = isStoriesMode
    ? stories.reduce((acc: User[], story) => {
        const user = story.user;
        if (user && !acc.some((u) => u.id === user.id)) acc.push(user);
        return acc;
      }, [])
    : users;

  // For stories mode ensure we pass user-specific stories to StoryItem so it can choose preview
  return (
    <Card className='flex flex-col transition-all duration-300 hover:shadow-lg w-full max-w-full px-2'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Camera className='w-5 h-5' /> {title}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 min-w-0'>
        <ScrollArea className='w-full min-w-0 whitespace-nowrap' orientation='horizontal'>
          <div className='flex space-x-4 p-4 min-h-[120px]'>
            {uniqueUsers.length > 0 ? (
              uniqueUsers.map((user, index) => {
                // pass stories filtered for the given user when in stories mode
                const userStories = isStoriesMode ? stories.filter((s) => s.user?.id === user.id) : [];
                return <StoryItem key={`story-${index}`} user={user} stories={userStories} />;
              })
            ) : (
              <div className='min-h-[120px] flex items-center justify-center w-full'>
                <Empty>
                  <EmptyMedia>
                    <Camera className='w-12 h-12 p-2' />
                  </EmptyMedia>
                  <EmptyTitle>Nu există povești încă</EmptyTitle>
                  <EmptyDescription>Fii primul care împărtășește o poveste și angajează comunitatea!</EmptyDescription>
                </Empty>
              </div>
            )}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
