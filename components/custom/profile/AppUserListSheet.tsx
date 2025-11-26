'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { User } from '@/lib/types';

interface AppUserListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  users: User[];
  loading: boolean;
  onUserClick?: (user: User) => void;
}

export default function AppUserListSheet({
  open,
  onOpenChange,
  title,
  users,
  loading,
  onUserClick,
}: AppUserListSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full md:w-1/3'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className='mt-4 space-y-4'>
          {loading ? (
            <div className='text-center'>Se încarcă...</div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <p className='font-medium'>{user.name}</p>
                  <p className='text-sm text-muted-foreground'>{user.email}</p>
                </div>
                {onUserClick && (
                  <Button variant='outline' size='sm' onClick={() => onUserClick(user)}>
                    Vezi profil
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className='text-center text-muted-foreground'>Nimic de afișat</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}