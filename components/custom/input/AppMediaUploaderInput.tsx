'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { MediaUploader } from '@/components/custom/media/MediaUploader';

type AppMediaUploaderInputProps = {
  label?: string;
  error?: { message?: string }[];
  required?: boolean;
  className?: string;
  htmlFor?: string;
  uploaderKey?: number;
  onFilesChange: (files: File[]) => void;
  id?: string;
  accept?: string;
  name?: string;
  maxFiles?: number;
  showPreview?: boolean;
  disabled?: boolean;
  layout?: 'row' | 'col'; // new: layout for avatar (row) vs cover (col)
};

export const AppMediaUploaderInput: React.FC<AppMediaUploaderInputProps> = ({
  label,
  error,
  required,
  className = '',
  htmlFor,
  uploaderKey,
  onFilesChange,
  id,
  accept,
  name,
  maxFiles,
  showPreview,
  disabled,
  layout = 'row',
}) => {
  // choose wrapper classes based on layout
  const wrapperClass = layout === 'col' ? 'flex flex-col items-start gap-2 w-full' : 'flex items-center gap-2';

  // if layout is col (cover) restrict to single file preview
  const effectiveMaxFiles = layout === 'col' ? 1 : maxFiles;

  return (
    <Field className={className}>
      {label && (
        <FieldLabel htmlFor={htmlFor} required={required}>
          {label}
        </FieldLabel>
      )}
      <div className={wrapperClass}>
        <MediaUploader
          key={uploaderKey}
          onFilesChange={onFilesChange}
          id={id}
          accept={accept}
          maxFiles={effectiveMaxFiles}
          showPreview={showPreview}
          name={name}
          disabled={disabled}
          layout={layout}
        />
      </div>
      {error && <FieldError errors={error} />}
    </Field>
  );
};
