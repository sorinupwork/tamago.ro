import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type AppPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export const AppPagination: React.FC<AppPaginationProps> = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent className='flex-wrap justify-center'>
        <PaginationItem>
          <PaginationPrevious onClick={() => onPageChange(Math.max(1, currentPage - 1))} className='cursor-default' />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink onClick={() => onPageChange(page)} isActive={page === currentPage} className='cursor-default'>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} className='cursor-default' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
