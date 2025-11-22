import { Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { StoryWithUser, User } from '@/lib/types';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '../empty/Empty';
import { getStories } from '@/actions/social/stories/actions';
import StoryItem from '@/components/custom/card/StoryItem';

type StoriesSectionProps = {
  mode: 'stories' | 'users';
  title?: string;
  users?: User[];
};

export const StoriesSection: React.FC<StoriesSectionProps> = async ({ mode, title = 'Stories', users = [] }) => {
  const storiesData = await getStories({ limit: 50 });
  const stories = storiesData.items;

  const isStoriesMode = mode === 'stories';

  const uniqueUsers: StoryWithUser[] = isStoriesMode
    ? stories.reduce((acc: StoryWithUser[], story) => {
        const userId = story.user?.id;
        if (userId && !acc.some((u) => u.user?.id === userId)) {
          acc.push(story);
        }
        return acc;
      }, [])
    : users.map(user => ({ user } as StoryWithUser));

  return (
    <>
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
                uniqueUsers.map((item, index) => {
                  const user = isStoriesMode ? item.user : item.user;
                  return (
                    <StoryItem key={`story-${index}`} user={user} stories={isStoriesMode ? stories : []} />
                  );
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
    </>
  );
};
