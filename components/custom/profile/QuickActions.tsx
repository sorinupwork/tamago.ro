import { useState } from 'react';
import { Camera, FileText, BarChart, Plus, X, Zap, Image, Video, Smile } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppTextarea from '@/components/custom/input/AppTextarea';
import { AppMediaUploaderInput } from '@/components/custom/input/AppMediaUploaderInput';

type QuickActionsProps = {
  onAddStories?: () => void;
  onAddFeedPost?: () => void;
  onCreatePoll?: () => void;
};

export default function QuickActions({ onAddStories, onAddFeedPost, onCreatePoll }: QuickActionsProps) {
  const [openDialog, setOpenDialog] = useState<'stories' | 'feed' | 'poll' | null>(null);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollQuestion, setPollQuestion] = useState('');
  const [feedText, setFeedText] = useState('');
  const [storyCaption, setStoryCaption] = useState('');
  const [feedFiles, setFeedFiles] = useState<File[]>([]);
  const [storyFiles, setStoryFiles] = useState<File[]>([]);

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

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const resetPoll = () => {
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const resetFeed = () => {
    setFeedText('');
    setFeedFiles([]);
  };

  const resetStory = () => {
    setStoryCaption('');
    setStoryFiles([]);
  };

  return (
    <TooltipProvider>
      <>
        <Card className='hover:shadow-lg transition-all duration-300 rounded-xl'>
          <CardHeader>
            <CardTitle className='text-sm flex items-center'>
              <Zap className='h-4 w-4 mr-2 text-primary' />
              Acțiuni Rapide (Vânzări & Social)
            </CardTitle>
            <p className='text-xs text-muted-foreground'>Creează și distribuie conținut pentru a angaja comunitatea Tamago.</p>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size='sm' variant='outline' className='w-full hover:scale-105 transition-transform' onClick={handleAddStories}>
                  <Camera className='h-3 w-3 mr-1' />
                  Adaugă Stories
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
                  Adaugă Postare Feed
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
                  Creează Sondaj
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Angajează urmăritorii cu o întrebare rapidă.</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>

        {/* Add Stories Dialog */}
        <Dialog
          open={openDialog === 'stories'}
          onOpenChange={(open) => {
            setOpenDialog(open ? 'stories' : null);
            if (!open) resetStory();
          }}
        >
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle className='flex items-center'>
                <Camera className='h-5 w-5 mr-2' />
                Adaugă o Poveste
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <AppMediaUploaderInput label='Capturează sau Încarcă Media' onFilesChange={setStoryFiles} uploaderKey={1} />
              <div>
                <Label htmlFor='story-caption'>Adaugă o Legendă (Opțional)</Label>
                <Textarea
                  id='story-caption'
                  placeholder='Spune ceva distractiv...'
                  rows={2}
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  className='mt-1'
                />
              </div>
              <Button className='w-full' disabled={storyFiles.length === 0}>
                Postează Povestea
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Feed Post Dialog */}
        <Dialog
          open={openDialog === 'feed'}
          onOpenChange={(open) => {
            setOpenDialog(open ? 'feed' : null);
            if (!open) resetFeed();
          }}
        >
          <DialogContent className='max-w-lg'>
            <DialogHeader>
              <DialogTitle className='flex items-center'>
                <FileText className='h-5 w-5 mr-2' />
                Creează o Postare
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <AppTextarea
                label="Ce ai pe suflet?"
                placeholder='Împărtășește-ți gândurile...'
                value={feedText}
                onChange={setFeedText}
                icon={Smile}
              />
              <div className='flex space-x-2'>
                <Button size='sm' variant='outline' onClick={() => document.getElementById('feed-media')?.click()}>
                  <Image className='h-4 w-4 mr-1' />
                  Poză
                </Button>
                <Button size='sm' variant='outline'>
                  <Video className='h-4 w-4 mr-1' />
                  Video
                </Button>
                <Button size='sm' variant='outline'>
                  <Smile className='h-4 w-4 mr-1' />
                  Sentiment
                </Button>
              </div>
              <AppMediaUploaderInput label='Adaugă Poze/Video' onFilesChange={setFeedFiles} uploaderKey={2} htmlFor='feed-media' />
              <Button className='w-full' disabled={!feedText.trim() && feedFiles.length === 0}>
                Postează pe Feed
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Poll Dialog */}
        <Dialog
          open={openDialog === 'poll'}
          onOpenChange={(open) => {
            setOpenDialog(open ? 'poll' : null);
            if (!open) resetPoll();
          }}
        >
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle className='flex items-center'>
                <BarChart className='h-5 w-5 mr-2' />
                Creează un Sondaj
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='poll-question'>Întrebare Sondaj</Label>
                <Input
                  id='poll-question'
                  placeholder='Întreabă ceva distractiv...'
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <Label>Opțiuni</Label>
                <div className='space-y-2 mt-1'>
                  {pollOptions.map((option, index) => (
                    <div key={index} className='flex items-center space-x-2'>
                      <Input placeholder={`Opțiunea ${index + 1}`} value={option} onChange={(e) => updatePollOption(index, e.target.value)} />
                      {pollOptions.length > 2 && (
                        <Button size='sm' variant='ghost' onClick={() => removePollOption(index)}>
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button size='sm' variant='outline' onClick={addPollOption} className='mt-2'>
                  <Plus className='h-4 w-4 mr-1' />
                  Adaugă Opțiune
                </Button>
              </div>
              <div>
                <Label>Previzualizare</Label>
                <RadioGroup className='mt-1'>
                  {pollOptions
                    .filter((o) => o.trim())
                    .map((option, index) => (
                      <div key={index} className='flex items-center space-x-2'>
                        <RadioGroupItem value={option} id={`preview-${index}`} disabled />
                        <Label htmlFor={`preview-${index}`}>{option || `Opțiunea ${index + 1}`}</Label>
                      </div>
                    ))}
                </RadioGroup>
              </div>
              <Button className='w-full' disabled={!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2}>
                Creează Sondaj
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </TooltipProvider>
  );
}
