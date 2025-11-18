import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarsProps {
  posts: number;
  friends: number;
  points: number;
  postsGoal?: number;
  friendsGoal?: number;
  pointsGoal?: number;
}

export default function ProgressBars({
  posts,
  friends,
  points,
  postsGoal = 20,
  friendsGoal = 10,
  pointsGoal = 200,
}: ProgressBarsProps) {
  return (
    <div className='space-y-6'>
      <div>
        <div className='flex justify-between mb-2'>
          <span>Posts: {posts}/{postsGoal}</span>
          <span>{Math.round((posts / postsGoal) * 100)}%</span>
        </div>
        <Progress value={(posts / postsGoal) * 100} className='h-3' />
      </div>
      <div>
        <div className='flex justify-between mb-2'>
          <span>Friends: {friends}/{friendsGoal}</span>
          <span>{Math.round((friends / friendsGoal) * 100)}%</span>
        </div>
        <Progress value={(friends / friendsGoal) * 100} className='h-3' />
      </div>
      <div>
        <div className='flex justify-between mb-2'>
          <span>Points: {points}/{pointsGoal}</span>
          <span>{Math.round((points / pointsGoal) * 100)}%</span>
        </div>
        <Progress value={(points / pointsGoal) * 100} className='h-3' />
      </div>
    </div>
  );
}
