'use client';

import dynamic from 'next/dynamic';
import { LucideIcon } from 'lucide-react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  EditorProvider,
  Toolbar,
  BtnUndo,
  BtnRedo,
  Separator,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnLink,
  BtnClearFormatting,
} from 'react-simple-wysiwyg';

const Editor = dynamic(() => import('react-simple-wysiwyg').then((mod) => mod.Editor), { ssr: false });

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: { message?: string }[];
  required?: boolean;
  htmlFor?: string;
  icon?: LucideIcon;
};

export default function AppTextarea({
  value = '',
  onChange,
  placeholder,
  className = '',
  label,
  error,
  required,
  htmlFor,
  icon: Icon,
}: Props) {
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
    <Field className={className}>
      {label && (
        <FieldLabel htmlFor={htmlFor} required={required}>
          {Icon && <Icon className='h-4 w-4 mr-2' />} {label}
        </FieldLabel>
      )}
      <div className='rsw-root w-full min-w-0 wrap-break-word overflow-hidden'>
        <EditorProvider>
          <Editor
            className='wrap-break-word overflow-wrap-break-word w-full'
            containerProps={{ style: { minHeight: '150px' } }}
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
          >
            <Toolbar>
              <BtnUndo />
              <BtnRedo />
              <Separator />
              <BtnBold />
              <BtnItalic />
              <BtnUnderline />
              <BtnStrikeThrough />
              <Separator />
              <BtnLink />
              <BtnClearFormatting />
            </Toolbar>
          </Editor>
        </EditorProvider>
      </div>
      {error && <FieldError errors={error} />}
    </Field>
  );
}
