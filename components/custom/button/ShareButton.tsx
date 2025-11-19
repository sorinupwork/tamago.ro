'use client';

import { toast } from 'sonner';
import { ShareIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ShareButtonProps = {
  href: string;
};

export default function ShareButton({ href }: ShareButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='bg-white/80 dark:bg-black/80'
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(`${window.location.origin}${href}`);
              toast.success('Link copied to clipboard');
            }}
          >
            <ShareIcon className='w-4 h-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copiază link-ul</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
