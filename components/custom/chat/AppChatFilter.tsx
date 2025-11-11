import React from 'react';
import { User, Search, Mail, ArrowRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  selectedUser: UserType;
  setSelectedUser: (user: UserType) => void;
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
  return (
    <div className='flex-1 lg:flex-[0.382] space-y-4'>
      <Card className='h-full flex flex-col transition-all duration-300 hover:shadow-lg'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='w-5 h-5' /> Contacte Utilizatori
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 flex flex-col'>
          <ChatFilters search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
          {/* Add search icon to input if not present */}
          {/* Categories */}
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
          {/* Scrollable user list - make touch-friendly */}
          <ScrollArea className='flex-1'>
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
