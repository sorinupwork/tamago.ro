import Link from 'next/link';
import { BookOpen, Users, Heart, ArrowRight, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function MoreInfo() {
  return (
    <section className='bg-background w-full mx-auto max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl py-2'>
      <h2 className='text-2xl font-bold text-center sm:text-end mb-4 text-secondary hover:shine'>Mai Multe Resurse</h2>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='bg-muted p-6 rounded-lg shine border border-muted-foreground/10 ring-2 ring-primary/20 hover:ring-primary/40 focus:ring-primary/40 transition flex flex-col justify-between'>
            <div>
              <h3 className='text-xl font-semibold mb-4 text-foreground flex items-center gap-2'>
                <BookOpen className='w-5 h-5 text-destructive' /> Ghiduri Detaliate
              </h3>
              <p className='text-muted-foreground mb-4'>
                Descoperă tutoriale pas cu pas pentru a maximiza utilizarea dispozitivelor Tamago. De la configurare inițială până la
                funcții avansate, avem totul acoperit.
              </p>
            </div>
            <Link href='/suport'>
              <Button className='w-full'>
                Explorează Ghiduri <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </Link>
          </div>

          <div className='bg-muted p-6 rounded-lg shine border border-muted-foreground/10 ring-2 ring-primary/20 hover:ring-primary/40 focus:ring-primary/40 transition flex flex-col justify-between'>
            <div>
              <h3 className='text-xl font-semibold mb-4 text-foreground flex items-center gap-2'>
                <Users className='w-5 h-5 text-destructive' /> Comunitate și Suport
              </h3>
              <p className='text-muted-foreground mb-4'>
                Alătură-te comunității Tamago pentru sfaturi, discuții și ajutor de la alți utilizatori. Suportul nostru este întotdeauna la
                un click distanță.
              </p>
            </div>
            <Link href='/social'>
              <Button className='w-full'>
                Alătură-te Comunității <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </Link>
          </div>
        </div>

        <div className='bg-muted p-6 rounded-lg shine border border-muted-foreground/10 ring-2 ring-primary/20 hover:ring-primary/40 focus:ring-primary/40 transition flex flex-col justify-between'>
          <div>
            <h3 className='text-xl font-semibold mb-4 text-foreground flex items-center gap-2'>
              <Heart className='w-5 h-5 text-destructive' /> Resurse Favorite
            </h3>
            <p className='text-muted-foreground mb-4'>
              Salvează și accesează rapid ghidurile și postările tale preferate din comunitate. Organizează-ți resursele pentru o experiență
              personalizată.
            </p>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant='secondary' className='w-full justify-between'>
                  Vezi Mai Multe <ChevronDown className='w-4 h-4' />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className='mt-4 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
                <p className='text-muted-foreground'>
                  Aici poți gestiona lista ta de favorite, inclusiv ghiduri utile, sfaturi din comunitate și actualizări personalizate.
                  Accesează-le oricând pentru a rămâne la curent cu cele mai importante resurse Tamago.
                </p>
                <Link href='/cont'>
                  <Button variant='link' className='hover:underline mt-2 px-0!'>
                    Accesează Cont <ArrowRight className='w-4 h-4 ml-2' />
                  </Button>
                </Link>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </section>
  );
}
