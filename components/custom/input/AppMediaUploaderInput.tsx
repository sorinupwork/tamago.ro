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
  id?: string; // Added for form integration
  accept?: string; // Added for file type restriction
  name?: string; // Added for form integration
  maxFiles?: number; // Added to limit files
  showPreview?: boolean; // Added to toggle preview display
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
}) => {
  return (
    <Field className={className}>
      {label && (
        <FieldLabel htmlFor={htmlFor} required={required}>
          {label}
        </FieldLabel>
      )}
      <div>
        <MediaUploader
          key={uploaderKey}
          onFilesChange={onFilesChange}
          id={id}
          accept={accept}
          maxFiles={maxFiles}
          showPreview={showPreview}
          name={name}
        />
      </div>
      {error && <FieldError errors={error} />}
    </Field>
  );
};
