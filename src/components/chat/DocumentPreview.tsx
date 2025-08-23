import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  File, 
  Download,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentPreviewProps {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  className?: string;
}

export const DocumentPreview = ({ 
  fileName, 
  fileUrl, 
  fileSize, 
  fileType,
  className 
}: DocumentPreviewProps) => {
  const getFileIcon = () => {
    if (!fileType) return <File className="h-8 w-8" />;
    
    if (fileType.startsWith('image/')) return <FileImage className="h-8 w-8 text-blue-500" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-8 w-8 text-purple-500" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="h-8 w-8 text-green-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (fileType.includes('document') || fileType.includes('word')) return <FileText className="h-8 w-8 text-blue-600" />;
    
    return <File className="h-8 w-8 text-muted-foreground" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImage = fileType?.startsWith('image/');
  const isPDF = fileType?.includes('pdf');
  const isVideo = fileType?.startsWith('video/');

  if (isImage) {
    return (
      <Card className={cn("overflow-hidden max-w-sm", className)}>
        <div className="relative group">
          <img 
            src={fileUrl} 
            alt={fileName} 
            className="w-full h-auto max-h-64 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </a>
            </Button>
            <Button size="sm" variant="secondary" asChild>
              <a href={fileUrl} download={fileName}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-medium truncate">{fileName}</p>
          {fileSize && <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>}
        </div>
      </Card>
    );
  }

  if (isPDF) {
    return (
      <Card className={cn("p-4 max-w-sm", className)}>
        <div className="flex items-start gap-3">
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{fileName}</p>
            {fileSize && <p className="text-sm text-muted-foreground">{formatFileSize(fileSize)}</p>}
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" asChild>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View PDF
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={fileUrl} download={fileName}>
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (isVideo) {
    return (
      <Card className={cn("overflow-hidden max-w-sm", className)}>
        <video 
          controls 
          className="w-full h-auto max-h-64"
          preload="metadata"
        >
          <source src={fileUrl} type={fileType} />
          Your browser does not support video playback.
        </video>
        <div className="p-3">
          <p className="text-sm font-medium truncate">{fileName}</p>
          {fileSize && <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>}
        </div>
      </Card>
    );
  }

  // Default file preview
  return (
    <Card className={cn("p-4 max-w-sm hover:bg-accent/50 transition-colors", className)}>
      <div className="flex items-center gap-3">
        {getFileIcon()}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{fileName}</p>
          {fileSize && <p className="text-sm text-muted-foreground">{formatFileSize(fileSize)}</p>}
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline" asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={fileUrl} download={fileName}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};