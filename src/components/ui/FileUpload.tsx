import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';
import { Card } from './card';
import { useFileUpload } from '@/hooks/useFileUpload';

interface FileUploadProps {
  onFileUploaded?: (fileId: string) => void;
  entityType?: 'request' | 'offer' | 'message';
  entityId?: string;
  maxFiles?: number;
  accept?: string[];
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  entityType,
  entityId,
  maxFiles = 5,
  accept = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  className = ''
}) => {
  const { uploadFile, uploading } = useFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ file: File; progress: number; id?: string }>>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles - uploadedFiles.length);
    
    // Add files to state with initial progress
    const filesWithProgress = newFiles.map(file => ({ file, progress: 0 }));
    setUploadedFiles(prev => [...prev, ...filesWithProgress]);

    // Upload each file
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const fileIndex = uploadedFiles.length + i;
      
      try {
        // Update progress
        setUploadedFiles(prev => 
          prev.map((f, idx) => 
            idx === fileIndex ? { ...f, progress: 50 } : f
          )
        );

        const uploadResult = await uploadFile(file);
        
        if (uploadResult) {
          setUploadedFiles(prev => 
            prev.map((f, idx) => 
              idx === fileIndex ? { ...f, progress: 100, id: uploadResult.id } : f
            )
          );
          onFileUploaded?.(uploadResult.id);
        } else {
          // Remove failed upload
          setUploadedFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
        }
      } catch (error) {
        // Remove failed upload
        setUploadedFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
      }
    }
  }, [uploadFile, entityType, entityId, onFileUploaded, maxFiles, uploadedFiles.length]);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploading || uploadedFiles.length >= maxFiles
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <Card
        {...getRootProps()}
        className={`
          p-6 border-2 border-dashed cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${uploading || uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            {isDragActive ? (
              <p>Drop files here...</p>
            ) : (
              <div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-muted-foreground">
                  Images, PDFs, and documents up to 10MB
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadedFiles.length}/{maxFiles} files uploaded
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadedFiles.map((fileData, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center space-x-3">
                {getFileIcon(fileData.file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileData.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {fileData.progress < 100 && (
                    <Progress value={fileData.progress} className="mt-1" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={fileData.progress > 0 && fileData.progress < 100}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};