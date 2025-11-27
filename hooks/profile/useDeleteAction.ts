import { useState } from 'react';
import { toast } from 'sonner';

export function useDeleteAction() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (
    deleteAction: () => Promise<{ success: boolean; message: string }>,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    try {
      const result = await deleteAction();
      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleDelete, isLoading };
}
