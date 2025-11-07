'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatInfo() {
  const [isDescOpen, setIsDescOpen] = useState(true);

  return (
    <div className='p-4 border-b bg-muted/50'>
      <Button variant='ghost' onClick={() => setIsDescOpen(!isDescOpen)} className='w-full justify-between p-0 h-auto'>
        <span className='text-sm font-medium'>Despre acest chat</span>
        {isDescOpen ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
      </Button>
      {isDescOpen && (
        <div className='mt-2 space-y-2 text-sm text-muted-foreground'>
          <div>
            <strong>Probleme cu platforma:</strong> Raportați erori, întârzieri sau funcționalități defecte.
          </div>
          <div>
            <strong>Raportări:</strong> Trimiteți feedback, sugestii sau reclamații despre serviciile noastre.
          </div>
          <div>
            <strong>Alte întrebări:</strong> Ajutor pentru cont, plăți sau orice alt aspect al Tamago.
          </div>
        </div>
      )}
    </div>
  );
}
