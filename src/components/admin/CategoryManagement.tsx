
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tree, TreeNode } from "@/components/ui/tree";
import { useCategories, Category } from "@/hooks/useCategories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";

export const CategoryManagement: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    parent_id: '',
    slug: '',
    name_en: '',
    name_ar: '',
    is_active: true,
    sort_order: 0
  });

  const resetForm = () => {
    setFormData({
      parent_id: '',
      slug: '',
      name_en: '',
      name_ar: '',
      is_active: true,
      sort_order: 0
    });
  };

  const handleCreateCategory = async () => {
    try {
      await createCategory({
        ...formData,
        parent_id: formData.parent_id || undefined
      });
      resetForm();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      parent_id: category.parent_id || '',
      slug: category.slug,
      name_en: category.name_en,
      name_ar: category.name_ar,
      is_active: category.is_active,
      sort_order: category.sort_order
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      await updateCategory(selectedCategory.id, {
        parent_id: formData.parent_id || undefined,
        slug: formData.slug,
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        is_active: formData.is_active,
        sort_order: formData.sort_order
      });
      resetForm();
      setSelectedCategory(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryNode = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    
    return (
      <div key={category.id} className="space-y-2">
        <div 
          className={`flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
            level > 0 ? 'ml-6 border-l-2 border-l-primary/20' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCategoryExpansion(category.id)}
                className="w-6 h-6 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {hasChildren ? (
                isExpanded ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />
              ) : (
                <div className="w-4 h-4" />
              )}
              
              <div>
                <h4 className="font-medium">
                  {isRTL ? category.name_ar : category.name_en}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {category.slug}
                </p>
              </div>
            </div>
            
            <Badge variant={category.is_active ? "default" : "secondary"}>
              {category.is_active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditCategory(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isRTL ? 'تأكيد الحذف' : 'Confirm Deletion'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isRTL ? 
                      `هل أنت متأكد من حذف فئة "${category.name_ar}"؟ سيتم حذف جميع الفئات الفرعية أيضاً.` :
                      `Are you sure you want to delete "${category.name_en}"? All subcategories will also be deleted.`
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                    {isRTL ? 'حذف' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {category.children!.map(child => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const CategoryForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      {/* Parent Category Selection */}
      <div>
        <Label htmlFor="parent_id">
          {isRTL ? 'الفئة الأساسية (اختياري)' : 'Parent Category (Optional)'}
        </Label>
        <select
          id="parent_id"
          value={formData.parent_id}
          onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
          className="w-full p-2 border rounded-md"
        >
          <option value="">{isRTL ? 'لا يوجد (فئة رئيسية)' : 'None (Main Category)'}</option>
          {categories.map(category => (
            <React.Fragment key={category.id}>
              <option value={category.id}>{isRTL ? category.name_ar : category.name_en}</option>
              {category.children?.map(child => (
                <option key={child.id} value={child.id}>
                  └ {isRTL ? child.name_ar : child.name_en}
                </option>
              ))}
            </React.Fragment>
          ))}
        </select>
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug">
          {isRTL ? 'الرمز المميز' : 'Slug'} *
        </Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          placeholder="category-slug"
          required
        />
      </div>

      {/* English Name */}
      <div>
        <Label htmlFor="name_en">
          {isRTL ? 'الاسم بالإنجليزية' : 'English Name'} *
        </Label>
        <Input
          id="name_en"
          value={formData.name_en}
          onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
          placeholder="Category Name"
          required
        />
      </div>

      {/* Arabic Name */}
      <div>
        <Label htmlFor="name_ar">
          {isRTL ? 'الاسم بالعربية' : 'Arabic Name'} *
        </Label>
        <Input
          id="name_ar"
          value={formData.name_ar}
          onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
          placeholder="اسم الفئة"
          required
          dir="rtl"
        />
      </div>

      {/* Sort Order */}
      <div>
        <Label htmlFor="sort_order">
          {isRTL ? 'ترتيب العرض' : 'Sort Order'}
        </Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
          min="0"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">
          {isRTL ? 'نشط' : 'Active'}
        </Label>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isRTL ? 'إدارة الفئات' : 'Category Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة فئات الشراء والفئات الفرعية' : 'Manage procurement categories and subcategories'}
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              {isRTL ? 'إضافة فئة' : 'Add Category'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? 'إنشاء فئة جديدة' : 'Create New Category'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleCreateCategory}>
                {isRTL ? 'إنشاء' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? 'شجرة الفئات' : 'Category Tree'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map(category => renderCategoryNode(category))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'لا توجد فئات حتى الآن' : 'No categories yet'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? 'تعديل الفئة' : 'Edit Category'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm isEdit />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleUpdateCategory}>
              {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
