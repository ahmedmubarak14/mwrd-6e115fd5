import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  parent_id?: string;
  is_active: boolean;
  sort_order: number;
  children?: Category[];
}

export const CategoryManagement: React.FC = () => {
  // Include inactive categories for admin management
  const { categories, loading, createCategory, updateCategory, deleteCategory, refetch } = useCategories(true);
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    slug: '',
    parent_id: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    refetch();
    
    // Debug user role
    console.log('Current user profile:', userProfile);
    if (userProfile) {
      console.log('User role:', userProfile.role);
      console.log('User status:', userProfile.status);
    }
  }, []);

  // Check if user has admin role
  const isAdmin = userProfile?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to manage categories.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('Submitting form data:', formData);
      console.log('Editing category:', editingCategory);
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast({
          title: t('common.success'),
          description: t('category.categoryUpdated')
        });
      } else {
        await createCategory(formData);
        toast({
          title: t('common.success'), 
          description: t('category.categoryCreated')
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Form submission error:', error);
      // Error handling is now done in the hook
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to delete categories.",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(t('category.deleteCategoryConfirm'))) {
      try {
        await deleteCategory(id);
        toast({
          title: t('common.success'),
          description: t('category.categoryDeleted')
        });
        refetch();
      } catch (error) {
        console.error('Delete error:', error);
        // Error handling is now done in the hook
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_ar: '',
      slug: '',
      parent_id: '',
      is_active: true,
      sort_order: 0
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: Category) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to edit categories.",
        variant: "destructive"
      });
      return;
    }

    setEditingCategory(category);
    setFormData({
      name_en: category.name_en,
      name_ar: category.name_ar,
      slug: category.slug,
      parent_id: category.parent_id || '',
      is_active: category.is_active,
      sort_order: category.sort_order
    });
    setIsDialogOpen(true);
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map(category => (
      <div key={category.id} className="space-y-2">
        <Card className={`${level > 0 ? (isRTL ? 'mr-8' : 'ml-8') : ''}`}>
          <CardContent className="p-4">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={cn("flex items-center space-x-2", isRTL && "flex-row-reverse space-x-reverse")}>
                {level > 0 && <ChevronRight className={cn("h-4 w-4 text-muted-foreground", isRTL && "transform rotate-180")} />}
                <div className={cn(isRTL ? "text-right" : "text-left")}>
                  <h4 className="font-medium">{category.name_en}</h4>
                  <p className="text-sm text-muted-foreground">{category.name_ar}</p>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? t('common.active') : t('common.inactive')}
                  </Badge>
                </div>
              </div>
              <div className={cn("flex space-x-2", isRTL && "flex-row-reverse space-x-reverse")}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(category)}
                  disabled={!isAdmin}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  disabled={!isAdmin}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {category.children && category.children.length > 0 && 
          renderCategoryTree(category.children, level + 1)
        }
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        {t('category.loadingCategories')}
      </div>
    );
  }

  // Show warning if user is not admin
  if (!isAdmin) {
    return (
      <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              You need admin privileges to access category management. 
              {userProfile ? ` Your current role is: ${userProfile.role}` : ' Please ensure you are logged in with an admin account.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h1 className="text-3xl font-bold">{t('category.management')}</h1>
          <p className="text-muted-foreground">{t('category.manageDescription')}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('category.addCategory')}
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? t('category.editCategory') : t('category.createCategory')}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? t('category.updateCategory') : t('category.categoryDetails')}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_en">{t('category.englishName')}</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_ar">{t('category.arabicName')}</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="slug">{t('category.slug')}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
              
              <div className={cn("flex items-center space-x-2", isRTL && "flex-row-reverse space-x-reverse")}>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">{t('category.isActive')}</Label>
              </div>
              
              <div className={cn("flex justify-end space-x-2", isRTL && "flex-row-reverse space-x-reverse")}>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {editingCategory ? t('common.update') : t('common.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {categories && categories.length > 0 ? renderCategoryTree(categories) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {t('category.noCategories')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
