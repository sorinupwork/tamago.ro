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
};

export const AppMediaUploaderInput: React.FC<AppMediaUploaderInputProps> = ({
  label,
  error,
  required,
  className = '',
  htmlFor,
  uploaderKey,
  onFilesChange,
}) => {
  return (
    <Field className={className}>
      {label && (
        <FieldLabel htmlFor={htmlFor} required={required}>
          {label}
        </FieldLabel>
      )}
      <div>
        <MediaUploader key={uploaderKey} onFilesChange={onFilesChange} />
      </div>
      {error && <FieldError errors={error} />}
    </Field>
  );
};
