import { Download, File, Image, Music, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileAttachmentProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  onDownload?: () => void;
}

export const FileAttachment = ({ 
  fileName, 
  fileSize, 
  fileType, 
  fileUrl, 
  onDownload 
}: FileAttachmentProps) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Show image preview for image files
  if (fileType.startsWith('image/')) {
    return (
      <Card className="max-w-sm overflow-hidden">
        <div className="relative">
          <img 
            src={fileUrl} 
            alt={fileName}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => window.open(fileUrl, '_blank')}
          />
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
        <div className="p-3">
          <p className="font-medium text-sm truncate">{fileName}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
        </div>
      </Card>
    );
  }

  // Show file card for other file types
  return (
    <Card className="p-3 max-w-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded-md">
          {getFileIcon(fileType)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{fileName}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
        >
          <Download className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};