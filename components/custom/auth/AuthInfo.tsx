import { CheckCircle, List } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

type AuthInfoProps = {
  whyTitle: string;
  whyDescription: string;
  whyList: string[];
  howTitle: string;
  howList: string[];
};

export default function AuthInfo({ whyTitle, whyDescription, whyList, howTitle, howList }: AuthInfoProps) {
  return (
    <div className='w-full gap-2 flex flex-col'>
      <Separator />
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold flex items-center animate-pulse'>
          <CheckCircle className='mr-2 h-5 w-5 text-green-500' />
          {whyTitle}
        </h3>
        <p className='text-sm text-muted-foreground'>{whyDescription}</p>
        <ul className='list-disc list-inside text-sm space-y-2 wrap-break-word'>
          {whyList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold flex items-center animate-pulse'>
          <List className='mr-2 h-5 w-5 text-blue-500' />
          {howTitle}
        </h3>
        <ol className='list-decimal list-inside text-sm space-y-2 wrap-break-word'>
          {howList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
