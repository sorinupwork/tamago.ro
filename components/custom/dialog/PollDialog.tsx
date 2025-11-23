'use client';

import { BarChart, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AppInput } from '@/components/custom/input/AppInput';
import { createPollAction } from '@/actions/social/feeds/actions';
import { useSession } from '@/lib/auth/auth-client';
import { Empty, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/custom/empty/Empty';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PollDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const addOption = () => setOptions((s) => [...s, '']);
  const removeOption = (i: number) => setOptions((s) => s.filter((_, idx) => idx !== i));
  const updateOption = (idx: number, value: string) =>
    setOptions((s) => {
      const next = s.map((v, i) => (i === idx ? value : v));
      if (next.filter((o) => o.trim().length > 0).length >= 2) setContentError(null);
      return next;
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setContentError(null);
    if (!question.trim()) return setContentError('Întrebarea este obligatorie');
    const nonEmptyOptions = options.filter((o) => o.trim().length > 0);
    if (nonEmptyOptions.length < 2) return setContentError('Trebuie cel puțin 2 opțiuni ne-goale');

    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      await createPollAction(fd);
      setQuestion('');
      setOptions(['', '']);
      onOpenChange(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Eroare la crearea sondajului');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setQuestion('');
          setOptions(['', '']);
        }
      }}
    >
      <DialogContent className='max-w-md' onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <BarChart className='h-5 w-5 mr-2' />
            Creează un Sondaj
          </DialogTitle>
        </DialogHeader>

        {!session ? (
          <div className='min-h-[300px] flex items-center justify-center'>
            <Empty>
              <EmptyMedia>
                <BarChart className='w-12 h-12 p-2' />
              </EmptyMedia>
              <EmptyTitle>Conectează-te pentru a crea sondaje</EmptyTitle>
              <EmptyDescription>
                Trebuie să fii conectat pentru a crea sondaje și a angaja comunitatea. Conectează-te pentru a începe.
              </EmptyDescription>
              <Button onClick={() => router.push('/cont')}>Conectează-te</Button>
            </Empty>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <AppInput
                label='Întrebare'
                id='poll-question'
                name='question'
                placeholder='Întreabă ceva...'
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (e.target.value.trim().length > 0) setContentError(null);
                }}
              />
              <p className='text-sm text-destructive mt-1 min-h-4'>{contentError ?? ''}</p>
            </div>

            <div>
              <Label>Opțiuni</Label>
              <div className='space-y-2 mt-2'>
                {options.map((opt, i) => (
                  <div key={i} className='flex items-center space-x-2'>
                    <AppInput
                      placeholder={`Opțiunea ${i + 1}`}
                      value={opt}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => updateOption(i, e.target.value)}
                    />
                    {options.length > 2 && (
                      <Button type='button' size='sm' variant='ghost' onClick={() => removeOption(i)}>
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                    <input type='hidden' name='options' value={opt} />
                  </div>
                ))}
              </div>
              <Button type='button' size='sm' variant='outline' onClick={addOption} className='mt-2'>
                <Plus className='h-4 w-4 mr-1' /> Adaugă Opțiune
              </Button>
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              Creează Sondaj
            </Button>
            {error ? <p className='text-sm text-destructive mt-1'>{error}</p> : <p className='text-sm mt-1 min-h-4' />}
            {loading && <p className='text-sm text-muted-foreground mt-1'>Se creează sondajul…</p>}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
