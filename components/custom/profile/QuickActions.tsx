import { useState } from 'react';
import { Camera, FileText, BarChart, Zap, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import StoryDialog from '@/components/custom/dialog/StoryDialog';
import FeedDialog from '@/components/custom/dialog/FeedDialog';
import PollDialog from '@/components/custom/dialog/PollDialog';

type QuickActionsProps = {
  onAddStories?: () => void;
  onAddFeedPost?: () => void;
  onCreatePoll?: () => void;
};

export default function QuickActions({ onAddStories, onAddFeedPost, onCreatePoll }: QuickActionsProps) {
  const [openDialog, setOpenDialog] = useState<'stories' | 'feed' | 'poll' | null>(null);

  const handleAddStories = () => {
    setOpenDialog('stories');
    onAddStories?.();
  };

  const handleAddFeedPost = () => {
    setOpenDialog('feed');
    onAddFeedPost?.();
  };

  const handleCreatePoll = () => {
    setOpenDialog('poll');
    onCreatePoll?.();
  };

  return (
    <TooltipProvider>
      <>
        <Card className='hover:shadow-lg transition-all duration-300 rounded-xl'>
          <CardHeader>
            <CardTitle className='text-sm flex items-center'>
              <Zap className='h-4 w-4 mr-2 text-primary' />
              Acțiuni Rapide
            </CardTitle>
            <p className='text-xs text-muted-foreground'>Creează și distribuie conținut pentru a angaja comunitatea Tamago.</p>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='outline' className='w-full hover:scale-105 transition-transform' onClick={handleAddStories}>
                  <Camera className='h-3 w-3 mr-1' />
                  <span className='truncate'>Adaugă Stories</span>
                  <Plus className='h-3 w-3 ml-1' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribuie poze/video rapide care dispar după 24 de ore.</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='outline' className='w-full hover:scale-105 transition-transform' onClick={handleAddFeedPost}>
                  <FileText className='h-3 w-3 mr-1' />
                  <span className='truncate'>Adaugă Postare Feed</span>
                  <Plus className='h-3 w-3 ml-1' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Postează actualizări, poze sau gânduri pe timeline-ul tău.</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='outline' className='w-full hover:scale-105 transition-transform' onClick={handleCreatePoll}>
                  <BarChart className='h-3 w-3 mr-1' />
                  <span className='truncate'>Creează Sondaj</span>
                  <Plus className='h-3 w-3 ml-1' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Angajează urmăritorii cu o întrebare rapidă.</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>

        <StoryDialog open={openDialog === 'stories'} onOpenChange={(open) => setOpenDialog(open ? 'stories' : null)} />

        <FeedDialog open={openDialog === 'feed'} onOpenChange={(open) => setOpenDialog(open ? 'feed' : null)} />

        <PollDialog open={openDialog === 'poll'} onOpenChange={(open) => setOpenDialog(open ? 'poll' : null)} />
      </>
    </TooltipProvider>
  );
}
