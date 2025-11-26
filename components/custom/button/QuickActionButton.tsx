'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type QuickActionButtonProps = {
  href: string;
};

export default function QuickActionButton({ href }: QuickActionButtonProps) {
  const router = useRouter();

  const handleQuickAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}${href}`);
    toast.success('Link copied to clipboard');
    router.push(href);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='sm' onClick={handleQuickAction} className='h-8 w-8 p-0'>
            <Zap className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Acțiune rapidă: favorite, copiază și navighează</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
