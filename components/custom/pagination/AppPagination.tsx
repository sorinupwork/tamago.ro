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

const AppPagination: React.FC<AppPaginationProps> = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages < 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <Pagination className={className}>
      <PaginationContent className='flex-wrap justify-center'>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => !prevDisabled && onPageChange(Math.max(1, currentPage - 1))}
            aria-disabled={prevDisabled}
            className={prevDisabled ? 'opacity-50 pointer-events-none' : ''}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
              className='cursor-default'
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => !nextDisabled && onPageChange(Math.min(totalPages, currentPage + 1))}
            aria-disabled={nextDisabled}
            className={nextDisabled ? 'opacity-50 pointer-events-none' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
