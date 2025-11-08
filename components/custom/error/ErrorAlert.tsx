import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  buttonText?: string;
}

export default function ErrorAlert({ message, onClose, buttonText = 'Close' }: ErrorAlertProps) {
  return (
    <div className='flex items-center justify-between p-4 bg-destructive/20 border border-destructive text-destructive rounded gap-4'>
      <span className='text-primary'>{message}</span>
      {onClose && (
        <Button onClick={onClose} variant='destructive' size='sm'>
          {buttonText}
        </Button>
      )}
    </div>
  );
}
