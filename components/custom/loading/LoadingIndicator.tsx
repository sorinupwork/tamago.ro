import { Spinner } from '@/components/ui/spinner';

type LoadingIndicatorProps = {
  color?: string;
  size?: number;
  text?: string;
  showText?: boolean;
  inline?: boolean;
};

export default function LoadingIndicator({ color, size = 32, text = 'Se încarcă...', showText = true, inline = false }: LoadingIndicatorProps) {
  const containerClass = inline ? 'flex items-center gap-2' : 'flex flex-col items-center justify-center gap-4';
  const textElement = inline ? <span className='text-secondary'>{text}</span> : <p className='text-secondary'>{text}</p>;

  return (
    <div className={containerClass}>
      <Spinner style={{ width: size, height: size, color: color || '#ff9900' }} />
      {showText && textElement}
    </div>
  );
}
