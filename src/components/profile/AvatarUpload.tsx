import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userInitials: string;
  onAvatarUpdate: (url: string) => void;
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userInitials,
  onAvatarUpdate,
  className
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Replace existing file
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      const avatarUrl = urlData.publicUrl;

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate(avatarUrl);
      setPreviewUrl(null);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;

    setUploading(true);

    try {
      // Update profile to remove avatar URL
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: null })
        .eq('user_id', user.id);

      if (error) throw error;

      onAvatarUpdate('');
      setPreviewUrl(null);
      
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed",
      });

    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Remove failed",
        description: "Failed to remove avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage 
                src={previewUrl || currentAvatarUrl} 
                alt="Profile picture"
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <LoadingSpinner size="lg" className="text-white" />
              </div>
            )}
            
            <Button
              size="sm"
              variant="secondary"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={triggerFileInput}
              disabled={uploading}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              Upload a photo or company logo. Max size 5MB.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            
            {currentAvatarUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeAvatar}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};