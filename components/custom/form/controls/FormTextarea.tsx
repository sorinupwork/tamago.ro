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
    <div className='rsw-root w-full min-w-0 break-words overflow-hidden'>
      <style>{`
        /* Target any nested element the editor may render */
        .rsw-root * {
          white-space: pre-wrap !important;
          overflow-wrap: break-word !important;
          word-break: break-word !important;
          box-sizing: border-box !important;
          min-width: 0 !important;
          max-width: none !important;
        }
        /* Also specifically target contenteditable if present */
        .rsw-root [contenteditable="true"] {
          width: 100% !important;
        }
      `}</style>

      <Editor
        className='break-words overflow-wrap-break-word w-full'
        style={{
          maxWidth: 'none',
          width: '100%',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
        value={value}
        onChange={(p: unknown) => handleChange(p)}
        placeholder={placeholder}
      />
    </div>
  );
}
