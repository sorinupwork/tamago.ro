import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { categories } from '@/lib/categories';

export default function GoldenCategories() {
  return (
    <section className='py-8'>
      <h2 className='text-2xl font-bold text-center mb-4 text-secondary'>Categorii Populare</h2>
      <style>{`
        @keyframes lift {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .lift:hover {
          animation: lift 0.3s ease-in-out;
        }
      `}</style>
      <Carousel
        opts={{
          align: 'start',
          containScroll: 'trimSnaps',
        }}
        className='w-full max-w-7xl mx-auto'
      >
        <CarouselContent className='pt-4'>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <CarouselItem key={category.id} className='basis-1/3.5'>
                <div className='max-w-xs'>
                  <Link href={category.href}>
                    <Card className='lift cursor-pointer'>
                      <CardContent className='flex items-center gap-2'>
                        {Icon && <Icon className='w-12 h-12 text-primary shrink-0' />}
                        <div className='flex flex-col flex-1'>
                          <h3 className='font-bold text-lg truncate text-start'>{category.title}</h3>
                          <p className='text-sm text-muted-foreground line-clamp-2 text-start'>{category.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
