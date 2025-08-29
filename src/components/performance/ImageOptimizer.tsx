import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Zap, 
  FileImage,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OptimizationSettings {
  quality: number;
  format: 'webp' | 'jpeg' | 'png' | 'avif';
  maxWidth: number;
  maxHeight: number;
  progressive: boolean;
}

interface OptimizedImage {
  original: {
    file: File;
    size: number;
    dimensions: { width: number; height: number };
  };
  optimized: {
    blob: Blob;
    size: number;
    dimensions: { width: number; height: number };
    url: string;
  };
  compressionRatio: number;
  sizeSaved: number;
}

export const ImageOptimizer = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<OptimizedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [settings, setSettings] = useState<OptimizationSettings>({
    quality: 85,
    format: 'webp',
    maxWidth: 1920,
    maxHeight: 1080,
    progressive: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;

    setProcessing(true);
    const optimizedImages: OptimizedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: `${file.name} is not an image file`,
          variant: 'destructive'
        });
        continue;
      }

      try {
        const optimized = await optimizeImage(file, settings);
        optimizedImages.push(optimized);
      } catch (error) {
        console.error('Error optimizing image:', error);
        toast({
          title: 'Optimization Failed',
          description: `Failed to optimize ${file.name}`,
          variant: 'destructive'
        });
      }
    }

    setImages(prev => [...prev, ...optimizedImages]);
    setProcessing(false);

    if (optimizedImages.length > 0) {
      toast({
        title: 'Images Optimized',
        description: `Successfully optimized ${optimizedImages.length} image(s)`,
        variant: 'default'
      });
    }
  }, [settings, toast]);

  const optimizeImage = async (file: File, settings: OptimizationSettings): Promise<OptimizedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const originalDimensions = { width, height };

        if (width > settings.maxWidth || height > settings.maxHeight) {
          const ratio = Math.min(settings.maxWidth / width, settings.maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create optimized blob'));
              return;
            }

            const optimized: OptimizedImage = {
              original: {
                file,
                size: file.size,
                dimensions: originalDimensions
              },
              optimized: {
                blob,
                size: blob.size,
                dimensions: { width, height },
                url: URL.createObjectURL(blob)
              },
              compressionRatio: Math.round((1 - blob.size / file.size) * 100),
              sizeSaved: file.size - blob.size
            };

            resolve(optimized);
          },
          `image/${settings.format}`,
          settings.quality / 100
        );
      };

      img.onerror = (error) => reject(error);
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadOptimized = (image: OptimizedImage) => {
    const link = document.createElement('a');
    link.href = image.optimized.url;
    link.download = `optimized_${image.original.file.name.split('.')[0]}.${settings.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    images.forEach(image => downloadOptimized(image));
  };

  const clearImages = () => {
    images.forEach(image => URL.revokeObjectURL(image.optimized.url));
    setImages([]);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSavings = images.reduce((sum, img) => sum + img.sizeSaved, 0);
  const averageCompression = images.length > 0 
    ? Math.round(images.reduce((sum, img) => sum + img.compressionRatio, 0) / images.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            Image Optimizer
          </h2>
          <p className="text-muted-foreground">
            Optimize images for better performance and faster loading
          </p>
        </div>
      </div>

      {/* Settings Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Optimization Settings
          </CardTitle>
          <CardDescription>
            Configure image optimization parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quality">Quality: {settings.quality}%</Label>
              <Input
                id="quality"
                type="range"
                min="10"
                max="100"
                value={settings.quality}
                onChange={(e) => setSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Output Format</Label>
              <select
                id="format"
                value={settings.format}
                onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value as any }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="webp">WebP (Recommended)</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="avif">AVIF (Modern)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxWidth">Max Width (px)</Label>
              <Input
                id="maxWidth"
                type="number"
                value={settings.maxWidth}
                onChange={(e) => setSettings(prev => ({ ...prev, maxWidth: parseInt(e.target.value) }))}
                min="100"
                max="4000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxHeight">Max Height (px)</Label>
              <Input
                id="maxHeight"
                type="number"
                value={settings.maxHeight}
                onChange={(e) => setSettings(prev => ({ ...prev, maxHeight: parseInt(e.target.value) }))}
                min="100"
                max="4000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardContent className="py-8">
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Images to Optimize</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop images here, or click to select files
            </p>
            <Button disabled={processing}>
              {processing ? 'Processing...' : 'Select Images'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileImage className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Images Optimized</span>
              </div>
              <p className="text-2xl font-bold">{images.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Total Savings</span>
              </div>
              <p className="text-2xl font-bold text-success">{formatBytes(totalSavings)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Avg. Compression</span>
              </div>
              <p className="text-2xl font-bold text-success">{averageCompression}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col gap-2">
              <Button onClick={downloadAll} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              <Button onClick={clearImages} variant="outline" className="flex-1">
                Clear All
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
            <CardDescription>
              Compare original and optimized images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <img 
                        src={URL.createObjectURL(image.original.file)} 
                        alt="Original"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Original</p>
                    </div>
                    <div className="text-center">
                      <img 
                        src={image.optimized.url} 
                        alt="Optimized"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Optimized</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate max-w-xs">{image.original.file.name}</span>
                      <Badge variant={image.compressionRatio > 50 ? "default" : "secondary"} className="bg-success text-success-foreground">
                        -{image.compressionRatio}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Original</p>
                        <p className="font-medium">{formatBytes(image.original.size)}</p>
                        <p className="text-xs text-muted-foreground">
                          {image.original.dimensions.width}×{image.original.dimensions.height}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Optimized</p>
                        <p className="font-medium text-success">{formatBytes(image.optimized.size)}</p>
                        <p className="text-xs text-muted-foreground">
                          {image.optimized.dimensions.width}×{image.optimized.dimensions.height}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Saved</p>
                        <p className="font-medium text-success">{formatBytes(image.sizeSaved)}</p>
                        <p className="text-xs text-muted-foreground">
                          {settings.format.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => downloadOptimized(image)}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};