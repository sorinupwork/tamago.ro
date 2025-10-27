import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { categories } from '@/lib/categories';

export default function GoldenCategories() {
  return (
    <section className='py-8'>
      <h2 className='text-2xl font-bold text-center mb-4 text-secondary'>Categorii Populare</h2>
      <Carousel className='w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl'>
        <CarouselContent className='py-4 px-2'>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <CarouselItem key={category.id} className='basis-1/1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'>
                <div className=''>
                  <Link href={category.href}>
                    <Card className='lift cursor-pointer'>
                      <CardContent className='flex items-center gap-2 px-2 sm:px-6'>
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
