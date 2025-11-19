'use client';

import { toast } from 'sonner';
import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type FavoriteButtonProps = {
  itemId: string;
};

export default function FavoriteButton({ itemId }: FavoriteButtonProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Add to favorites in DB
    toast.success('Adăugat la favorite!');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='sm' onClick={handleFavorite} className='h-8 w-8 p-0'>
            <Heart className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adaugă la favorite</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
