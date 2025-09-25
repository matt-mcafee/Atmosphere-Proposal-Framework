'use client';

import { UploadCloud, File as FileIcon, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useState, useMemo, useRef, ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

type ModuleCardProps = {
  id: string;
  title: string;
  description: string;
  onUpload: (dataUri: string) => Promise<any>;
  onSuccess: (result: any) => void;
  acceptedTypes?: string;
  cta: string;
};

export function ModuleCard({ id, title, description, onUpload, onSuccess, acceptedTypes, cta }: ModuleCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setStatus('idle');
      handleUpload(selectedFile);
    }
  };

  const handleUpload = (fileToUpload: File) => {
    if (!fileToUpload) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      if (dataUri) {
        setStatus('uploading');
        setError(null);
        try {
          const result = await onUpload(dataUri);
          setStatus('success');
          onSuccess(result);
        } catch (err) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
      } else {
        setStatus('error');
        setError('Could not read file.');
      }
    };
    reader.onerror = () => {
      setStatus('error');
      setError('Error reading file.');
    };
    reader.readAsDataURL(fileToUpload);
  };
  
  const statusIcon = useMemo(() => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-destructive" />;
      default:
        return <UploadCloud className="h-6 w-6 text-muted-foreground" />;
    }
  }, [status]);

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setError(null);
    if(inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex flex-1 flex-col justify-center items-center text-center p-6">
          <div className="flex flex-col items-center space-y-2">
            {statusIcon}
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          
          <div className="mt-4 w-full">
            <Label htmlFor={id} className={`relative flex flex-col items-center justify-center w-full h-24 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted ${status !== 'idle' ? 'pointer-events-none' : ''}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file && status !== 'idle' ? (
                        <div className="text-sm text-foreground flex items-center gap-2">
                            <FileIcon className="h-4 w-4" />
                            <span className='max-w-[120px] truncate'>{file.name}</span>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">{cta}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Click to upload</p>
                        </>
                    )}
                </div>
                <Input id={id} ref={inputRef} type="file" className="hidden" onChange={handleFileChange} accept={acceptedTypes} disabled={status !== 'idle'} />
            </Label>
            
            {status === 'error' && <p className="mt-2 text-xs text-destructive">{error}</p>}

            {(status === 'success' || status === 'error') && (
              <Button onClick={reset} variant="link" size="sm" className="mt-2 text-xs">
                Upload another file
              </Button>
            )}
          </div>
      </CardContent>
    </Card>
  );
}
