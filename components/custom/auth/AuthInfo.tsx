'use client';

import { useState } from 'react';
import { Shield, TrendingUp, Users, Bell, BookOpen, Info, Trophy } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

type AuthInfoProps = {
  whyTitle: string;
  whyDescription: string;
  whyList: string[];
  howTitle: string;
  howList: string[];
  benefitsTitle: string;
  benefitsDescription: string;
  benefitsList: string[];
};

const whyIcons = [Shield, TrendingUp, Users, Bell, BookOpen];
const benefitsIcons = [Trophy, Trophy, Trophy, Trophy, Trophy, Trophy];

export default function AuthInfo({
  whyTitle,
  whyDescription,
  whyList,
  howTitle,
  howList,
  benefitsTitle,
  benefitsDescription,
  benefitsList,
}: AuthInfoProps) {
  const [openItems, setOpenItems] = useState<string[]>(['why']);

  const handleValueChange = (value: string[]) => {
    setOpenItems(value.includes('why') ? value : [...value, 'why']);
  };

  return (
    <div className='w-full'>
      <Accordion type='multiple' value={openItems} onValueChange={handleValueChange} className='w-full'>
        <AccordionItem value='why'>
          <AccordionTrigger className='text-lg font-semibold [&>svg]:rotate-0 [&>svg]:transition-none'>{whyTitle}</AccordionTrigger>
          <AccordionContent className='flex flex-col gap-6 text-balance'>
            <div className='flex items-start gap-2'>
              <Info className='h-4 w-4 text-muted-foreground mt-0.5 shrink-0' />
              <p className='text-sm text-muted-foreground'>{whyDescription}</p>
            </div>
            <ul className='space-y-3'>
              {whyList.map((item, index) => {
                const Icon = whyIcons[index] || Shield;
                return (
                  <li key={index} className='flex items-start'>
                    <Icon className='mr-2 h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                    <span className='text-sm'>{item}</span>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='how'>
          <AccordionTrigger className='text-lg font-semibold [&>svg]:rotate-0 [&>svg]:transition-none'>{howTitle}</AccordionTrigger>
          <AccordionContent className='flex flex-col gap-6 text-balance'>
            <ol className='space-y-3'>
              {howList.map((item, index) => (
                <li key={index} className='flex items-start'>
                  <Badge variant='outline' className='mr-2 text-sm font-semibold text-blue-500'>
                    {index + 1}
                  </Badge>
                  <span className='text-sm'>{item}</span>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='benefits'>
          <AccordionTrigger className='text-lg font-semibold [&>svg]:rotate-0 [&>svg]:transition-none'>{benefitsTitle}</AccordionTrigger>
          <AccordionContent className='flex flex-col gap-6 text-balance'>
            <div className='flex items-start gap-2'>
              <Trophy className='h-4 w-4 text-yellow-500 mt-0.5 shrink-0' />
              <p className='text-sm text-muted-foreground'>{benefitsDescription}</p>
            </div>
            <ul className='space-y-3'>
              {benefitsList.map((item, index) => {
                const Icon = benefitsIcons[index] || Trophy;
                return (
                  <li key={index} className='flex items-start'>
                    <Icon className='mr-2 h-4 w-4 text-yellow-500 mt-0.5 shrink-0' />
                    <span className='text-sm'>{item}</span>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
