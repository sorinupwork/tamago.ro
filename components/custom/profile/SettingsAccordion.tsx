import React from 'react';
import { CheckCircle, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface SettingsAccordionProps {
  value: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function SettingsAccordion({ value, icon, title, content, buttonText, onButtonClick }: SettingsAccordionProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className='text-lg font-semibold [&>svg]:rotate-0 [&>svg]:transition-none'>
        {icon}
        {title}
      </AccordionTrigger>
      <AccordionContent className='flex flex-col gap-6 text-balance'>
        {content}
        {buttonText && onButtonClick && (
          <div>
            <Button variant='outline' className='mt-2' onClick={onButtonClick}>
              {buttonText}
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
