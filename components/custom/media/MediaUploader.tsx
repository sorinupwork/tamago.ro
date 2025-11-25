'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, X, FileVideo } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type MediaUploaderProps = {
  onFilesChange: (files: File[]) => void;
  showPreview?: boolean;
  accept?: string;
  maxFiles?: number;
  errorMessage?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  layout?: 'row' | 'col';
};

type PreviewFile = {
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
};

export function MediaUploader({
  onFilesChange,
  showPreview,
  accept = 'image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation',
  maxFiles = 10,
  errorMessage,
  id,
  name,
  disabled = false,
  layout = 'row',
}: MediaUploaderProps) {
  const [previews, setPreviews] = useState<PreviewFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews: PreviewFile[] = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : 'document',
      }));
      const updatedPreviews = [...previews, ...newPreviews].slice(0, maxFiles);
      setPreviews(updatedPreviews);
      onFilesChange(updatedPreviews.map((p) => p.file));
    },
    [previews, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => ({ ...acc, [type.trim()]: [] }), {}),
    maxFiles,
    multiple: true,
    disabled,
  });

  const removePreview = (index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    onFilesChange(updatedPreviews.map((p) => p.file));
  };

  return (
    <div className='space-y-4 grow'>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-default transition-colors ${
          disabled
            ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
            : errorMessage
              ? 'border-red-500 bg-red-50'
              : isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps({ id, name })} />
        <Upload className={`mx-auto h-12 w-12 mb-4 ${errorMessage ? 'text-red-400' : 'text-gray-400'}`} />
        <p className={`text-sm mb-1 ${errorMessage ? 'text-red-600' : 'text-gray-600'}`}>
          {disabled
            ? 'Uploader disabled'
            : isDragActive
              ? 'Aruncați fișierele aici...'
              : 'Trageți și aruncați fișiere sau faceți clic pentru a selecta'}
        </p>
        <p className={`text-xs ${errorMessage ? 'text-red-500' : 'text-gray-500'}`}>
          Acceptă imagini, videouri și documente (minim 1, maxim {maxFiles} fișiere)
        </p>
      </div>

      {previews.length > 0 && showPreview && (
        <>
          {layout === 'col' ? (
            <div className='w-full'>
              {(() => {
                const preview = previews[0];
                return (
                  <Card className='relative w-full'>
                    <CardContent className='p-0'>
                      {preview.type === 'image' ? (
                        <Image
                          src={preview.preview}
                          alt='Cover preview'
                          width={1200}
                          height={320}
                          className='w-full h-48 md:h-56 object-cover rounded'
                        />
                      ) : preview.type === 'video' ? (
                        <div className='relative w-full h-48 md:h-56'>
                          <video src={preview.preview} className='w-full h-full object-cover rounded' controls={false} muted />
                          <FileVideo className='absolute inset-0 m-auto h-8 w-8 text-white bg-black/50 rounded-full p-1' />
                        </div>
                      ) : (
                        <div className='w-full h-48 md:h-56 bg-gray-100 rounded flex items-center justify-center'>
                          <p className='text-gray-500 text-sm'>Previzualizare document</p>
                        </div>
                      )}
                    </CardContent>
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      className='absolute top-2 right-2 z-10'
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(0);
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </Card>
                );
              })()}
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {previews.map((preview, index) => (
                <Card key={index} className='relative'>
                  <CardContent className='p-2'>
                    {preview.type === 'image' ? (
                      <Image
                        src={preview.preview}
                        alt={`Preview ${index}`}
                        width={150}
                        height={150}
                        className='w-full h-32 object-cover rounded'
                      />
                    ) : preview.type === 'video' ? (
                      <div className='relative w-full h-32'>
                        <video src={preview.preview} className='w-full h-full object-cover rounded' controls={false} muted />
                        <FileVideo className='absolute inset-0 m-auto h-8 w-8 text-white bg-black/50 rounded-full p-1' />
                      </div>
                    ) : (
                      <div className='w-full h-32 bg-gray-100 rounded flex items-center justify-center'>
                        <p className='text-gray-500 text-sm'>Previzualizare document</p>
                      </div>
                    )}
                  </CardContent>
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    className='absolute top-1 right-1 z-10'
                    onClick={(e) => {
                      e.stopPropagation();
                      removePreview(index);
                    }}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {errorMessage && <p className='text-sm text-red-600'>{errorMessage}</p>}
    </div>
  );
}
