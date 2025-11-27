'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Empty, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/custom/empty/Empty';
import SkeletonLoading from '@/components/custom/loading/SkeletonLoading';
import FavoriteButton from '../button/FavoriteButton';
import { useSession } from '@/lib/auth/auth-client';
import { getFavorites } from '@/actions/auth/actions';
import { reverseCategoryMapping } from '@/lib/categories';

type Item = {
  id: string;
  title: string;
  image: string;
  category: string;
};

type FavoritesDrawerProps = {
  triggerIcon?: React.ReactNode;
  triggerText?: string;
  filterOptions?: string[];
  sortOptions?: string[];
  title?: string;
  description?: string;
  onOpenSearch?: () => void;
};

export default function FavoritesDrawer({
  triggerIcon = (
    <div className='p-1'>
      <Heart className='w-4 h-4' />
    </div>
  ),
  triggerText = 'Favorite',
  filterOptions = ['all', 'Auto', 'Electronics', 'Home', 'Fashion', 'Sports', 'Books', 'Toys'],
  sortOptions = ['title', 'none'],
  title = 'Favoritele tale',
  description = 'Vizualizează și gestionează articolele favorite.',
  onOpenSearch,
}: FavoritesDrawerProps) {
  const { data: session } = useSession();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<string[]>(['all']);
  const [sort, setSort] = useState<string>('title');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const fetchFavorites = useCallback(async () => {
    if (!session) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const favorites = await getFavorites();
      setItems(favorites.map((fav) => ({ id: fav.itemId, title: fav.title, image: fav.image, category: fav.category })));
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (drawerOpen) {
      fetchFavorites();
    }
  }, [drawerOpen, fetchFavorites]);

  const handleFavoritesUpdate = useCallback(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, [handleFavoritesUpdate]);

  const filteredItems = items
    .filter((item) => filters.includes('all') || filters.includes(item.category))
    .sort((a, b) => (sort === 'title' ? a.title.localeCompare(b.title) : 0));

  const handleFilterChange = (option: string) => {
    if (option === 'all') {
      setFilters(['all']);
    } else {
      setFilters((prev) => (prev.includes(option) ? prev.filter((f) => f !== option) : [...prev.filter((f) => f !== 'all'), option]));
    }
  };

  return (
    <Drawer onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          <div className='flex flex-row items-center gap-2 cursor-default'>
            {triggerIcon}
            <span className='hidden lg:inline'>{triggerText}</span>
          </div>
        </NavigationMenuLink>
      </DrawerTrigger>
      <DrawerContent className='max-h-[80vh]'>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className='p-4 space-y-4'>
          {loading ? (
            <SkeletonLoading variant='favorite' />
          ) : (
            <>
              <div className='flex justify-between items-center gap-4'>
                <ScrollArea orientation='horizontal' className='flex-1'>
                  <div className='flex gap-2'>
                    {filterOptions.map((option) => (
                      <Button
                        key={option}
                        variant={filters.includes(option) ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => handleFilterChange(option)}
                        disabled={!session}
                      >
                        {option === 'all' ? 'All' : option}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
                <div className='flex gap-2'>
                  {sortOptions.map((option) => (
                    <Button
                      key={option}
                      variant={sort === option ? 'secondary' : 'outline'}
                      size='sm'
                      onClick={() => setSort(option)}
                      disabled={!session}
                    >
                      {option === 'title' ? 'Sort by Title' : 'No Sort'}
                    </Button>
                  ))}
                </div>
              </div>

              {filteredItems.length > 0 ? (
                <Carousel opts={{ loop: true, align: 'start' }} className='w-full'>
                  <CarouselContent className='-ml-4'>
                    {filteredItems.map((item) => (
                      <CarouselItem key={item.id} className='pl-4 md:basis-1/3 lg:basis-1/4'>
                        <div className='p-1'>
                          <Card>
                            <CardContent className='p-4'>
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={0}
                                height={128}
                                className='w-full h-32 object-cover rounded'
                              />
                              <h3 className='mt-2 text-sm font-semibold'>{item.title}</h3>
                              <p className='text-xs text-muted-foreground'>{item.category}</p>
                              <div className='flex justify-between items-center mt-2'>
                                <FavoriteButton
                                  itemId={item.id}
                                  itemTitle={item.title}
                                  itemImage={item.image}
                                  itemCategory={item.category}
                                />
                                <Button
                                  className='w-auto'
                                  size='sm'
                                  onClick={() =>
                                    window.open(
                                      `/categorii/auto/${reverseCategoryMapping[item.category as keyof typeof reverseCategoryMapping] || item.category}/${item.id}`,
                                      '_blank'
                                    )
                                  }
                                >
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className='min-h-[300px] flex items-center justify-center'>
                  <Empty>
                    <EmptyMedia>
                      <Heart className='w-12 h-12 p-2' />
                    </EmptyMedia>
                    <EmptyTitle>{!session ? 'Conectează-te pentru a vedea favoritele' : 'Nu ai favorite găsite'}</EmptyTitle>
                    <EmptyDescription>
                      {!session
                        ? 'Trebuie să fii conectat pentru a vedea articolele favorite. Conectează-te pentru a accesa lista personalizată de favorite.'
                        : 'Nu ai adăugat încă favorite. Caută în colecția noastră și adaugă articole pentru acces rapid.'}
                    </EmptyDescription>
                    {!session ? (
                      <Button onClick={() => router.push('/cont')}>Conectează-te</Button>
                    ) : (
                      <DrawerClose asChild>
                        <Button onClick={() => onOpenSearch?.()}>Caută articole</Button>
                      </DrawerClose>
                    )}
                  </Empty>
                </div>
              )}
            </>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
