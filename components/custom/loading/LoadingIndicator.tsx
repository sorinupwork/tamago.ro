import { Spinner } from '@/components/ui/spinner';
import { Progress } from '@/components/ui/progress';

type LoadingIndicatorProps = {
  color?: string;
  size?: number;
  text?: string;
  showText?: boolean;
  inline?: boolean;
  showProgress?: boolean;
  progressValue?: number;
};

export default function LoadingIndicator({
  color,
  size = 32,
  text = 'Se încarcă...',
  showText = true,
  inline = false,
  showProgress = false,
  progressValue = 0,
}: LoadingIndicatorProps) {
  const containerClass = inline ? 'flex items-center gap-2' : 'flex grow flex-col items-center justify-center gap-4';
  const textElement = inline ? <span className='text-secondary'>{text}</span> : <p className='text-secondary'>{text}</p>;

  return (
    <div className={containerClass}>
      <Spinner style={{ width: size, height: size, color: color || '#ff9900' }} />
      {showText && textElement}
      {showProgress && (
        <div className='w-full space-y-2'>
          <p className='text-sm text-gray-600'>Se încarcă... {progressValue}%</p>
          <Progress value={progressValue} className='w-full' />
        </div>
      )}
    </div>
  );
}
