'use client';

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('react-simple-wysiwyg').then((mod) => ({ default: mod.default })), { ssr: false });

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function FormTextarea({ value = '', onChange, placeholder }: Props) {
  const handleChange = (payload: unknown) => {
    if (!onChange) return;
    if (typeof payload === 'string') {
      onChange(payload);
      return;
    }
    if (typeof payload === 'object' && payload !== null) {
      const maybeEvent = payload as { target?: { value?: unknown } };
      if (maybeEvent.target && typeof maybeEvent.target.value === 'string') {
        onChange(maybeEvent.target.value);
        return;
      }
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-auto break-words">
      <Editor className="break-words max-w-full" value={value} onChange={(p: unknown) => handleChange(p)} placeholder={placeholder} />
    </div>
  );
}
