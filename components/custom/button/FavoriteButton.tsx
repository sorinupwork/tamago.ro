'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSession } from '@/lib/auth/auth-client';
import { toggleFavorite, isFavorited } from '@/actions/auth/actions'; // Reverted to alias

type FavoriteButtonProps = {
  itemId: string;
  itemTitle?: string;
  itemImage?: string;
  itemCategory?: string;
};

export default function FavoriteButton({ itemId, itemTitle = '', itemImage = '', itemCategory = '' }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorited = async () => {
      if (session) {
        const favorited = await isFavorited(itemId);
        setIsFavorite(favorited);
      }
    };
    checkFavorited();
  }, [session, itemId]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Trebuie să fii conectat pentru a adăuga la favorite!');
      return;
    }

    setLoading(true);
    try {
      const result = await toggleFavorite(itemId, itemTitle, itemImage, itemCategory);
      setIsFavorite(result.isFavorited);
      toast.success(result.isFavorited ? 'Adăugat la favorite!' : 'Eliminat din favorite!');
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      toast.error('A apărut o eroare la actualizarea favoritei. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='sm' onClick={handleFavorite} className='h-8 w-8 p-0' disabled={loading}>
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
