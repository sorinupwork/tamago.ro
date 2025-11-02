'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File, Image as ImageIcon, Video } from 'lucide-react';
import Image from 'next/image';

type MediaUploaderProps = {
  category: string;
  onUpload?: (urls: string[]) => void;
};

export function MediaUploader({ category, onUpload }: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'application/*': ['.pdf', '.doc', '.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('category', category);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setUploadedUrls(data.urls);
        onUpload?.(data.urls);
        setFiles([]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className='h-4 w-4' />;
    if (file.type.startsWith('video/')) return <Video className='h-4 w-4' />;
    return <File className='h-4 w-4' />;
  };

  return (
    <div className='space-y-4'>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className='mx-auto h-8 w-8 text-muted-foreground' />
        <p className='mt-2 text-sm text-muted-foreground'>
          {isDragActive ? 'Eliberați fișierele aici...' : 'Trageți fișierele aici sau faceți clic pentru a selecta'}
        </p>
        <p className='text-xs text-muted-foreground'>Imagini, videouri, fișiere (max 10MB)</p>
      </div>

      {files.length > 0 && (
        <div className='space-y-2'>
          <h4 className='text-sm font-medium'>Fișiere selectate:</h4>
          {files.map((file, index) => (
            <div key={index} className='flex items-center gap-2 p-2 border rounded'>
              {getFileIcon(file)}
              <span className='text-sm flex-1'>{file.name}</span>
              <Button variant='ghost' size='sm' onClick={() => removeFile(index)}>
                <X className='h-4 w-4' />
              </Button>
            </div>
          ))}
          <Button onClick={uploadFiles} disabled={uploading} className='w-full'>
            {uploading ? 'Se încarcă...' : 'Încarcă Fișiere'}
          </Button>
          {uploading && <Progress value={progress} className='w-full' />}
        </div>
      )}

      {uploadedUrls.length > 0 && (
        <div className='space-y-2'>
          <h4 className='text-sm font-medium'>Fișiere încărcate:</h4>
          {uploadedUrls.map((url, index) => (
            <div key={index} className='flex items-center gap-2'>
              {url.includes('.mp4') || url.includes('.avi') ? (
                <Video className='h-4 w-4' />
              ) : url.includes('.pdf') || url.includes('.doc') ? (
                <File className='h-4 w-4' />
              ) : (
                <Image src={url} alt='Uploaded' width={32} height={32} className='rounded' />
              )}
              <a href={url} target='_blank' rel='noopener noreferrer' className='text-sm text-primary hover:underline'>
                {url.split('/').pop()}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
