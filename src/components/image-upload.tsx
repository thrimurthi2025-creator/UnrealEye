'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isAnalyzing?: boolean;
}

export function ImageUpload({ onUpload, isAnalyzing }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFile(null);
  };

  const handleAnalyze = () => {
    if(file) {
      onUpload(file);
    }
  };

  if (preview && file) {
    return (
      <div className="w-full text-center">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-border group">
          <Image src={preview} alt="Image preview" fill style={{ objectFit: 'contain' }} />
          <div 
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button size="icon" variant="destructive" onClick={handleRemove} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={handleAnalyze} className="mt-4" disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full cursor-pointer rounded-xl border-2 border-dashed border-border bg-card/80 p-12 text-center transition-colors hover:border-primary',
        isDragActive && 'border-primary bg-primary/10'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-foreground/60">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border-2 border-dashed">
            <UploadCloud className="h-8 w-8" />
        </div>
        <p className="font-semibold">Drag & drop an image here</p>
        <div className="flex items-center gap-2">
            <div className="h-px w-10 bg-border"></div>
            <span className="text-xs uppercase">or</span>
            <div className="h-px w-10 bg-border"></div>
        </div>
        <Button variant="outline">Browse File</Button>
      </div>
    </div>
  );
}
