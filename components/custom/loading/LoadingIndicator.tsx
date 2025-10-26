interface LoadingIndicatorProps {
  color?: string;
  size?: number;
  text?: string;
  showText?: boolean;
}

export default function LoadingIndicator({ size = 32, text = 'Se încarcă...', showText = true }: LoadingIndicatorProps) {
  const style = {
    borderColor: '#ff9900',
    borderTopColor: 'transparent',
    backgroundColor: 'var(--background)',
    width: size,
    height: size,
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='animate-spin rounded-full border-4' style={style} />
      {showText && <p className='text-secondary'>{text}</p>}
    </div>
  );
}
