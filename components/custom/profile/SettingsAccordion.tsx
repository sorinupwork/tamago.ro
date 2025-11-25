import React, { useState } from 'react';
import { Bell, Trophy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type SettingsAccordionProps = {
  value: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  subItems?: {
    value: string;
    title: string;
    content: React.ReactNode;
  }[];
  progressValue?: number;
  isNotifications?: boolean;
};

export default function SettingsAccordion({
  value,
  icon,
  title,
  content,
  className,
  subItems,
  defaultOpen = false,
  progressValue = 50,
  isNotifications = false,
}: SettingsAccordionProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const currentProgressValue = isNotifications ? (notificationsEnabled ? 100 : 0) : progressValue;

  return (
    <Accordion type='single' collapsible defaultValue={defaultOpen ? value : undefined} className='w-full'>
      <AccordionItem
        value={value}
        className={cn('w-full border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800', className)}
      >
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
          <Progress value={currentProgressValue} className='h-2' />
          <div className='text-sm text-muted-foreground'>Nivel Securitate: {currentProgressValue}%</div>

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

          {subItems && subItems.length > 0 && (
            <div className='mt-4'>
              <Accordion type='single' collapsible className='w-full space-y-2'>
                {subItems.map((s) => (
                  <AccordionItem key={s.value} value={s.value} className='border rounded-md bg-white dark:bg-gray-800'>
                    <AccordionTrigger className='px-3 py-2 text-sm font-medium'>{s.title}</AccordionTrigger>
                    <AccordionContent className='px-3 py-2 text-sm space-y-2'>
                      {s.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
