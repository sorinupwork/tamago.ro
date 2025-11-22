'use client';

import { BarChart, Plus, X } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AppInput } from '@/components/custom/input/AppInput';
import { createPollAction } from '@/actions/social/feeds/actions';
import { pollSchema, PollFormData } from '@/lib/validations';
import { useSession } from '@/lib/auth/auth-client';
import { Empty, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/custom/empty/Empty';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PollDialog({ open, onOpenChange }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: { question: '', options: [{ value: '' }, { value: '' }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const onSubmit = async (data: PollFormData) => {
    const formData = new FormData();
    formData.append('question', data.question);
    data.options.forEach((option) => formData.append('options', option.value));
    await createPollAction(formData);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
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
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <Controller
              name='question'
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor='poll-question'>Întrebare</Label>
                  <AppInput
                    id='poll-question'
                    placeholder='Întreabă ceva...'
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className='mt-1'
                    error={errors.question ? [{ message: errors.question.message }] : undefined}
                  />
                </div>
              )}
            />

            <div>
              <Label>Opțiuni</Label>
              <div className='space-y-2 mt-1'>
                {fields.map((field, index) => (
                  <Controller
                    key={field.id}
                    name={`options.${index}.value`}
                    control={control}
                    render={({ field: inputField }) => (
                      <div className='flex items-center space-x-2'>
                        <AppInput
                          placeholder={`Opțiunea ${index + 1}`}
                          value={inputField.value}
                          onChange={(e) => inputField.onChange(e.target.value)}
                          error={errors.options?.[index]?.value ? [{ message: errors.options[index]?.value?.message }] : undefined}
                        />
                        {fields.length > 2 && (
                          <Button type='button' size='sm' variant='ghost' onClick={() => remove(index)}>
                            <X className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    )}
                  />
                ))}
              </div>
              <Button type='button' size='sm' variant='outline' onClick={() => append({ value: '' })} className='mt-2'>
                <Plus className='h-4 w-4 mr-1' />
                Adaugă Opțiune
              </Button>
            </div>

            <Button type='submit' className='w-full' disabled={!isValid}>
              Creează Sondaj
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
