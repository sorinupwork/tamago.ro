import React from 'react';

import { User as UserType } from '@/lib/types';

type AppListItemProps = {
  user: UserType;
  selectedUser: UserType | null;
  setSelectedUser: (user: UserType | null) => void;
  leftIcon?: React.ReactNode;
  title: string;
  description?: string;
  date?: string;
  rightButton?: React.ReactNode;
};

export const AppListItem: React.FC<AppListItemProps> = ({
  user,
  selectedUser,
  setSelectedUser,
  leftIcon,
  title,
  description,
  date,
  rightButton,
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-2 hover:bg-muted transition-all duration-200 pinch ${
        selectedUser?.id === user.id ? 'bg-accent animate-pulse' : ''
      }`}
      onClick={() => selectedUser?.id === user.id ? setSelectedUser(null) : setSelectedUser(user)}
    >
      {leftIcon}
      <div className='flex-1'>
        <p className='font-medium'>{title}</p>
        {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        {date && <p className='text-xs text-muted-foreground'>{date}</p>}
      </div>
      {rightButton}
    </div>
  );
};
