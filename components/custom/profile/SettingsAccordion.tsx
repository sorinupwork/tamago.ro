import React, { useState } from 'react';
import { Bell, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SettingsAccordionProps {
  value: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function SettingsAccordion({ value, icon, title, content, buttonText, onButtonClick }: SettingsAccordionProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState(50);

  return (
    <AccordionItem value={value} className='border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800'>
      <AccordionTrigger className='text-lg font-semibold px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 [&>svg]:rotate-0 [&>svg]:transition-transform [&>svg]:duration-300'>
        <div className='flex items-center gap-2'>
          {icon}
          {title}
          <Badge variant='secondary' className='ml-2 animate-pulse'>
            Nou
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className='px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-300 bg-gray-50 dark:bg-gray-700 rounded-b-lg'>
        <div className='flex items-center gap-2'>
          <Trophy className='h-5 w-5 text-yellow-500' />
          <span className='font-medium'>Progres Setări</span>
        </div>
        <Progress value={privacyLevel} className='h-2' />
        <div className='text-sm text-muted-foreground'>Nivel Confidențialitate: {privacyLevel}%</div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Bell className='h-4 w-4' />
            <span>Notificări</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  className='bg-primary ring-1 ring-foreground'
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Activează notificări pentru actualizări!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {content}

        {buttonText && onButtonClick && (
          <Button variant='outline' className='w-full hover:scale-105 transition-transform' onClick={onButtonClick}>
            <Zap className='h-4 w-4 mr-2' />
            {buttonText}
          </Button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
