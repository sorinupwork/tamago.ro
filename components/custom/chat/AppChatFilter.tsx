import React, { useRef } from 'react';
import { User, ArrowRight, ChevronDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatFilters } from './ChatFilters';
import { AppListItem } from '../list/AppListItem';
import { User as UserType } from '@/lib/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex flex-col sm:flex-1 min-h-0 w-full ${selectedUser ? 'hidden sm:flex' : ''}`}>
      <Card className="flex flex-col flex-1 min-h-0 transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='w-5 h-5' /> Contacte Utilizatori
          </CardTitle>
        </CardHeader>
        
        <CardContent className='flex-1 flex flex-col min-h-0 relative'>
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

          <ScrollArea ref={scrollAreaRef} className='flex-1 overflow-y-auto'>
            <div className='space-y-2 p-2 pb-6'>
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
            </div>
            <ScrollBar />
          </ScrollArea>
          {/* <div className='absolute bottom-6 left-4'> */}
            <Button
              onClick={scrollToBottom}
              variant='ghost'
              size='sm'
              className='transition-all duration-200 hover:scale-105 active:scale-95'
            >
              <ChevronDown className='w-4 h-4' />
            </Button>
          {/* </div> */}
        </CardContent>
      </Card>
    </div>
  );
};
