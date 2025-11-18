import React from 'react';
import { Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickActionsProps {
  onCreatePost: () => void;
  onEditProfile: () => void;
}

export default function QuickActions({ onCreatePost, onEditProfile }: QuickActionsProps) {
  return (
    <Card className='hover:shadow-lg transition-all duration-300 rounded-xl'>
      <CardHeader>
        <CardTitle className='text-sm'>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Button
          size='sm'
          variant='outline'
          className='w-full hover:scale-105 transition-transform'
          onClick={onCreatePost}
        >
          <Edit className='h-3 w-3 mr-1' />
          Create Post
        </Button>
        <Button
          size='sm'
          variant='outline'
          className='w-full hover:scale-105 transition-transform'
          onClick={onEditProfile}
        >
          <Settings className='h-3 w-3 mr-1' />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
}
