'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useTransition, useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import AppTextarea from '@/components/custom/input/AppTextarea';
import AppMediaUploaderInput from '@/components/custom/input/AppMediaUploaderInput';
import AppTagsInput from '@/components/custom/input/AppTagsInput';
import AppInput from '@/components/custom/input/AppInput';
import { updateFeedPost, updatePollPost } from '@/actions/social/feeds/actions';
import type { FeedPost } from '@/lib/types';

type EditFeedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FeedPost | null;
  onSuccess?: () => void;
};

export default function EditFeedDialog({ open, onOpenChange, item, onSuccess }: EditFeedDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [newOptionInput, setNewOptionInput] = useState('');
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const isPoll = item?.type === 'poll';

  // Log when text or question changes
  useEffect(() => {
    console.log('\n=== EditFeedDialog state changed ===');
    if (isPoll) {
      console.log('POLL - question:', question);
      console.log('POLL - options:', options);
    } else {
      console.log('POST - text:', text);
      console.log('POST - tags:', tags);
      console.log('POST - filePreviews:', filePreviews);
    }
  }, [text, question, tags, options, filePreviews, isPoll]);

  const handleOpenChange = (isOpen: boolean) => {
    console.log('\n=== EditFeedDialog.handleOpenChange called ===');
    console.log('isOpen:', isOpen);
    
    if (!isOpen) {
      console.log('User closed dialog - resetting form');
      setText('');
      setQuestion('');
      setOptions([]);
      setTags([]);
      setNewFiles([]);
      setFilePreviews([]);
      setNewOptionInput('');
      setUploaderKey((p) => p + 1);
      onOpenChange(false);
    }
  };

  // Prefill form when dialog opens with item data
  useEffect(() => {
    if (open && item) {
      console.log('\n=== EditFeedDialog - Dialog opened, prefilling data ===');
      console.log('Full item object:', JSON.stringify(item, null, 2));
      
      if (isPoll) {
        console.log('--- POLL MODE ---');
        console.log('question:', item.question);
        console.log('options:', item.options);
        setQuestion(item.question || '');
        setOptions(item.options || []);
        setText('');
        setFilePreviews([]);
        setTags([]);
      } else {
        console.log('--- POST MODE ---');
        console.log('text:', item.text);
        console.log('tags:', item.tags);
        console.log('files:', item.files);
        setText(item.text || '');
        setTags(item.tags || []);
        setFilePreviews(item.files?.map((f) => f.url) || []);
        setQuestion('');
        setOptions([]);
      }
      setNewFiles([]);
    }
  }, [open, item, isPoll]);

  const handleFileChange = (files: File[]) => {
    setNewFiles(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setFilePreviews((prev) => {
      prev.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      return previews;
    });
  };

  const handleRemoveFile = (index: number) => {
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    const newFilesArray = newFiles.filter((_, i) => i !== index);
    setFilePreviews(newPreviews);
    setNewFiles(newFilesArray);
  };

  const handleAddOption = () => {
    if (newOptionInput.trim() && options.length < 10) {
      const newOptions = [...options, newOptionInput.trim()];
      setOptions(newOptions);
      setNewOptionInput('');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!item) return;

    if (isPoll) {
      if (!question.trim() || options.filter((o) => o.trim()).length < 2) {
        toast.error('Trebuie să adaugi o întrebare și cel puțin 2 opțiuni');
        return;
      }

      const formData = new FormData();
      formData.append('question', question);
      options.filter((o) => o.trim()).forEach((opt) => formData.append('options', opt));

      startTransition(async () => {
        try {
          const result = await updatePollPost(item.id, formData);
          if (result.success) {
            toast.success(result.message);
            handleOpenChange(false);
            onSuccess?.();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error('Eroare la actualizarea sondajului');
          console.error(error);
        }
      });
    } else {
      if (!text.trim() && newFiles.length === 0 && filePreviews.length === 0) {
        toast.error('Trebuie să adaugi text sau media');
        return;
      }

      const formData = new FormData();
      formData.append('text', text);

      tags.forEach((tag) => {
        if (tag.trim()) formData.append('tags', tag);
      });

      newFiles.forEach((file) => formData.append('files', file));

      startTransition(async () => {
        try {
          const result = await updateFeedPost(item.id, formData);
          if (result.success) {
            toast.success(result.message);
            handleOpenChange(false);
            onSuccess?.();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error('Eroare la actualizarea postării');
          console.error(error);
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className='max-w-2xl max-h-[90vh] overflow-y-auto'
        aria-describedby='edit-feed-description'
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{isPoll ? 'Editează Sondaj' : 'Editează Postare'}</DialogTitle>
          <DialogDescription>Formularul pentru editarea postării din feed</DialogDescription>
        </DialogHeader>

        {item && (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <FieldGroup>
              {isPoll ? (
                <>
                  <AppInput
                    label='Întrebarea'
                    placeholder='Adaugă întrebarea sondajului...'
                    name='question'
                    onChange={(e) => setQuestion(e.target.value)}
                    value={question}
                  />
                  <div className='space-y-3'>
                    <label className='text-sm font-medium'>Opțiuni (minim 2, maxim 10)</label>
                    <div className='space-y-2'>
                      {options.map((opt, idx) => (
                        <div key={idx} className='flex gap-2'>
                          <input
                            type='text'
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            className='flex-1 px-3 py-2 border rounded-md text-sm'
                            placeholder={`Opțiune ${idx + 1}`}
                          />
                          <button
                            type='button'
                            onClick={() => handleRemoveOption(idx)}
                            disabled={options.filter((o) => o.trim()).length <= 2}
                            className='px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md disabled:opacity-50'
                          >
                            Șterge
                          </button>
                        </div>
                      ))}
                    </div>
                    {options.length < 10 && (
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          value={newOptionInput}
                          onChange={(e) => setNewOptionInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOption();
                            }
                          }}
                          placeholder='Adaugă o nouă opțiune...'
                          className='flex-1 px-3 py-2 border rounded-md text-sm'
                        />
                        <button
                          type='button'
                          onClick={handleAddOption}
                          className='px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm'
                        >
                          Adaugă
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <AppTextarea
                  label='Conținut'
                  placeholder='Editează postarea...'
                  name='text'
                  onChange={(v: string) => setText(v)}
                  value={text}
                />
              )}
            </FieldGroup>

            {!isPoll && (
              <FieldGroup>
                <AppMediaUploaderInput
                  label='Media'
                  onFilesChange={handleFileChange}
                  maxFiles={10}
                  showPreview={true}
                  layout='col'
                  accept='image/*,video/*'
                  uploaderKey={uploaderKey}
                />
                {(filePreviews.length > 0 || (item?.files && item.files.length > 0)) && (
                  <div className='grid grid-cols-3 gap-2 mt-2'>
                    {filePreviews.map((url, idx) => (
                      <div key={idx} className='relative group w-24 h-24'>
                        <Image src={url} alt={`Preview ${idx}`} fill sizes='96px' className='object-cover rounded-md' />
                        <button
                          type='button'
                          onClick={() => handleRemoveFile(idx)}
                          className='absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FieldGroup>
            )}

            {!isPoll && (
              <FieldGroup>
                <AppTagsInput label='Taguri' tags={tags} onTagsChange={setTags} />
              </FieldGroup>
            )}

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => handleOpenChange(false)} disabled={isPending}>
                Anulează
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Se actualizează...' : 'Actualizează'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
