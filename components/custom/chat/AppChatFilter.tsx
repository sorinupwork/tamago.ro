import React, { useRef, useState } from 'react';
import { User, ArrowRight, ChevronDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ChatFilters } from './ChatFilters';
import { AppListItem } from '../list/AppListItem';
import { User as UserType } from '@/lib/types';

type AppChatFilterProps = {
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  selectedUser: UserType | null;
  setSelectedUser: (user: UserType | null) => void;
  filteredUsers: UserType[];
};

export const AppChatFilter: React.FC<AppChatFilterProps> = ({
  search,
  setSearch,
  sort,
  setSort,
  category,
  setCategory,
  selectedUser,
  setSelectedUser,
  filteredUsers,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className='flex flex-1 space-y-4 min-w-0'>
      <Card className='flex-1 flex flex-col transition-all duration-300 hover:shadow-lg'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='w-5 h-5' /> Contacte Utilizatori
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 flex flex-col min-h-0'>
          <ChatFilters search={search} setSearch={setSearch} sort={sort} setSort={setSort} />

          <Tabs value={category} onValueChange={setCategory} className='mb-4'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='Toți' className='transition-all duration-200 hover:scale-105 active:scale-95'>
                Toți
              </TabsTrigger>
              <TabsTrigger value='Prieteni' className='transition-all duration-200 hover:scale-105 active:scale-95'>
                Prieteni
              </TabsTrigger>
              <TabsTrigger value='Recenți' className='transition-all duration-200 hover:scale-105 active:scale-95'>
                Recenți
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <ScrollArea
            ref={scrollAreaRef}
            className='flex-1 max-h-64 lg:max-h-none'
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartY(e.clientY);
              const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
              if (viewport) setScrollTop(viewport.scrollTop);
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              e.preventDefault();
              const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
              if (viewport) {
                const walk = (e.clientY - startY) * 2;
                viewport.scrollTop = scrollTop - walk;
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            {filteredUsers.map((user) => (
              <AppListItem
                key={user.id}
                user={user}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                leftIcon={
                  <Avatar className='transition-all duration-200 hover:scale-110 active:scale-95'>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                }
                title={user.name}
                description={user.status}
                rightButton={
                  <Button variant='ghost'>
                    <ArrowRight />
                  </Button>
                }
              />
            ))}
            <ScrollBar />
          </ScrollArea>
          <div className='flex justify-center mt-2'>
            <Button
              onClick={scrollToBottom}
              variant='ghost'
              size='sm'
              className='transition-all duration-200 hover:scale-105 active:scale-95'
            >
              <ChevronDown className='w-4 h-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
