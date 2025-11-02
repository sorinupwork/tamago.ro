import { Spinner } from '@/components/ui/spinner';

type LoadingIndicatorProps = {
  color?: string;
  size?: number;
  text?: string;
  showText?: boolean;
};

export default function LoadingIndicator({ color, size = 32, text = 'Se încarcă...', showText = true }: LoadingIndicatorProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Spinner style={{ width: size, height: size, color: color || '#ff9900' }} />
      {showText && <p className='text-secondary'>{text}</p>}
    </div>
  );
}
