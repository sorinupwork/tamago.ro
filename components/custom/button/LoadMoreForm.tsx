'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import LoadMoreButton from './LoadMoreButton';

type ActionState = { success?: boolean; error?: string } | null;

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function LoadMoreForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <LoadMoreButton
        type='submit'
        loading={pending}
        label='Load More Feeds'
        loadingLabel='Refreshing...'
      />
    </form>
  );
}
