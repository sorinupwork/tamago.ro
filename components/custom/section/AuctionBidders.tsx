'use client';

import { Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { User } from '@/lib/types';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '../../ui/empty';
import StoryItem from '@/components/custom/card/StoryItem';

type Props = {
  users: User[];
  title?: string;
  limit?: number;
};

export default function AuctionBidders({ users = [], title = 'Participanți Licitație' }: Props) {
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
            {users.length > 0 ? (
              users.map((user, idx) => <StoryItem key={`bidder-${idx}`} user={user} stories={[]} />)
            ) : (
              <div className='min-h-[120px] flex items-center justify-center w-full'>
                <Empty>
                  <EmptyMedia>
                    <Camera className='w-12 h-12 p-2' />
                  </EmptyMedia>
                  <EmptyTitle>Nu există participanți</EmptyTitle>
                  <EmptyDescription>Nu există participanți la licitație pentru afișare.</EmptyDescription>
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
