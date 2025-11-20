'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type AppTagsInputProps = {
  label?: string;
  error?: { message?: string }[];
  required?: boolean;
  className?: string;
  htmlFor?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
};

export const AppTagsInput: React.FC<AppTagsInputProps> = ({
  label,
  error,
  required,
  className = '',
  htmlFor,
  tags,
  onTagsChange,
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      onTagsChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Field className={className}>
      {label && (
        <FieldLabel htmlFor={htmlFor} required={required}>
          {label}
        </FieldLabel>
      )}
      <div className='space-y-2'>
        <div className='flex gap-2'>
          <Input
            type='text'
            placeholder='Adaugă un tag...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className='flex-1'
          />
          <Button type='button' onClick={addTag} disabled={!inputValue.trim() || tags.length >= maxTags}>
            <Plus className='h-4 w-4' />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag, index) => (
              <span key={index} className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground'>
                {tag}
                <button type='button' onClick={() => removeTag(tag)} className='ml-1'>
                  <X className='h-3 w-3' />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      {error && <FieldError errors={error} />}
    </Field>
  );
};
