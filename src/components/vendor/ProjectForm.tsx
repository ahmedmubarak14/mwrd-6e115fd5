import { useState, useEffect } from "react";
import { useVendorProjects } from "@/hooks/useVendorProjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProjectFormProps {
  project?: any;
  onClose: () => void;
}

export const ProjectForm = ({ project, onClose }: ProjectFormProps) => {
  const { createProject, updateProject, loading } = useVendorProjects();
  const languageContext = useLanguage();
  const { toast } = useToast();
  const { isRTL } = languageContext || { isRTL: false };
  const t = languageContext?.t || ((key: string) => key);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    project_type: 'commercial' as 'commercial' | 'government' | 'private',
    start_date: '',
    end_date: '',
    project_value: '',
    currency: 'SAR',
    location: '',
    client_name: '',
    client_type: 'private_company' as 'government' | 'private_company' | 'individual',
    project_status: 'completed' as 'completed' | 'ongoing' | 'cancelled',
    visibility_level: 'public' as 'public' | 'private' | 'confidential',
    cr_reference: '',
    contract_value: '',
    project_scope: '',
    client_testimonial: '',
    is_featured: false
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        subcategory: project.subcategory || '',
        project_type: project.project_type || 'commercial',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        project_value: project.project_value?.toString() || '',
        currency: project.currency || 'SAR',
        location: project.location || '',
        client_name: project.client_name || '',
        client_type: project.client_type || 'private_company',
        project_status: project.project_status || 'completed',
        visibility_level: project.visibility_level || 'public',
        cr_reference: project.cr_reference || '',
        contract_value: project.contract_value?.toString() || '',
        project_scope: project.project_scope || '',
        client_testimonial: project.client_testimonial || '',
        is_featured: project.is_featured || false
      });
    }
  }, [project]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const projectData = {
        ...formData,
        project_value: formData.project_value ? parseFloat(formData.project_value) : undefined,
        contract_value: formData.contract_value ? parseFloat(formData.contract_value) : undefined,
        status: 'active',
      };

      if (project) {
        await updateProject(project.id, projectData);
        toast({
          title: t('common.success'),
          description: 'Project updated successfully',
        });
      } else {
        await createProject(projectData);
        toast({
          title: t('common.success'),
          description: 'Project created successfully',
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : 'Failed to save project',
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", isRTL && "rtl")}>
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('vendor.profile.basicInfo')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('vendor.projects.projectTitle')} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              className={isRTL ? "text-right" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_type">{t('vendor.projects.type')}</Label>
            <Select value={formData.project_type} onValueChange={(value) => handleInputChange('project_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commercial">{t('vendor.projects.commercial')}</SelectItem>
                <SelectItem value="government">{t('vendor.projects.government')}</SelectItem>
                <SelectItem value="private">{t('vendor.projects.private')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t('vendor.projects.description')}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={isRTL ? "text-right" : ""}
          />
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">{t('vendor.projects.startDate')}</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">{t('vendor.projects.endDate')}</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_status">{t('vendor.projects.status')}</Label>
            <Select value={formData.project_status} onValueChange={(value) => handleInputChange('project_status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">{t('vendor.projects.completed')}</SelectItem>
                <SelectItem value="ongoing">{t('vendor.projects.ongoing')}</SelectItem>
                <SelectItem value="cancelled">{t('vendor.projects.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project_value">{t('vendor.projects.value')}</Label>
            <Input
              id="project_value"
              type="number"
              value={formData.project_value}
              onChange={(e) => handleInputChange('project_value', e.target.value)}
              placeholder="100000"
              className={isRTL ? "text-right" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('vendor.projects.location')}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Riyadh, Saudi Arabia"
              className={isRTL ? "text-right" : ""}
            />
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client_name">{t('vendor.projects.clientName')}</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => handleInputChange('client_name', e.target.value)}
              className={isRTL ? "text-right" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_type">{t('vendor.projects.clientType')}</Label>
            <Select value={formData.client_type} onValueChange={(value) => handleInputChange('client_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="government">{t('vendor.projects.government')}</SelectItem>
                <SelectItem value="private_company">{t('vendor.projects.privateCompany')}</SelectItem>
                <SelectItem value="individual">{t('vendor.projects.individual')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="visibility_level">{t('vendor.projects.visibility')}</Label>
            <Select value={formData.visibility_level} onValueChange={(value) => handleInputChange('visibility_level', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">{t('vendor.projects.public')}</SelectItem>
                <SelectItem value="private">{t('common.private')}</SelectItem>
                <SelectItem value="confidential">{t('vendor.projects.confidential')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse pt-6">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
            />
            <Label htmlFor="is_featured">{t('vendor.projects.featured')}</Label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : null}
          {project ? t('common.update') : t('common.add')}
        </Button>
      </div>
    </form>
  );
};