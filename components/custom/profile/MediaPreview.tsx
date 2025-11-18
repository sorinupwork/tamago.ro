import React, { useEffect, useMemo } from 'react';

type MediaPreviewProps = {
  files?: (string | File)[];
  onRemove?: (index: number) => void;
  className?: string;
};

export default function MediaPreview({ files = [], onRemove, className = '' }: MediaPreviewProps) {
  // derive urls and track which object URLs we created
  const memo = useMemo(() => {
    const created: string[] = [];
    const urls = files.map((f) => {
      if (typeof f === 'string') return f;
      const url = URL.createObjectURL(f);
      created.push(url);
      return url;
    });
    return { urls, created };
  }, [files]);

  // revoke previously created object URLs when files change / on unmount
  useEffect(() => {
    const created = memo.created;
    return () => {
      created.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          /* ignore */
        }
      });
    };
  }, [memo]);

  if (!memo.urls.length) return null;

  return (
    <div className={`flex space-x-3 overflow-x-auto ${className}`}>
      {memo.urls.map((src, i) => (
        <div key={i} className='w-24 h-24 rounded-lg overflow-hidden bg-surface dark:bg-surface-dark flex-shrink-0 relative'>
          <img src={src} alt={`preview-${i}`} className='object-cover w-full h-full' />
          {onRemove && <button onClick={() => onRemove(i)} className='absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'>×</button>}
        </div>
      ))}
    </div>
  );
}
