import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminPageContainer } from './AdminPageContainer';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, ChevronRight, AlertTriangle, Search, Filter, Download, Grid, List, MoreHorizontal, Folder, FolderOpen } from 'lucide-react';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
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
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const { userProfile } = useAuth();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
  }, []);

  // Check if user has admin role
  const isAdmin = userProfile?.role === 'admin';

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!categories) return null;
    
    const flatCategories = categories.reduce((acc: Category[], cat: Category) => {
      acc.push(cat);
      if (cat.children) acc.push(...cat.children);
      return acc;
    }, []);

    return {
      total: flatCategories.length,
      active: flatCategories.filter(cat => cat.is_active).length,
      inactive: flatCategories.filter(cat => !cat.is_active).length,
      parentCategories: categories.length,
      subcategories: flatCategories.length - categories.length
    };
  }, [categories]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    const filterCategory = (cat: Category): Category | null => {
      const matchesSearch = searchQuery === '' || 
        cat.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && cat.is_active) ||
        (statusFilter === 'inactive' && !cat.is_active);

      const filteredChildren = cat.children?.map(filterCategory).filter(Boolean) || [];
      
      if (matchesSearch && matchesStatus) {
        return { ...cat, children: filteredChildren };
      } else if (filteredChildren.length > 0) {
        return { ...cat, children: filteredChildren };
      }
      
      return null;
    };

    return categories.map(filterCategory).filter(Boolean) as Category[];
  }, [categories, searchQuery, statusFilter]);

  // Flat categories for table view
  const flatCategories = useMemo(() => {
    if (!filteredCategories) return [];
    
    const flatten = (cats: Category[], level = 0): (Category & { level: number })[] => {
      return cats.reduce((acc, cat) => {
        acc.push({ ...cat, level });
        if (cat.children) {
          acc.push(...flatten(cat.children, level + 1));
        }
        return acc;
      }, [] as (Category & { level: number })[]);
    };

    return flatten(filteredCategories);
  }, [filteredCategories]);

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

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (!isAdmin || selectedCategories.length === 0) return;

    try {
      const promises = selectedCategories.map(id => {
        if (action === 'delete') {
          return deleteCategory(id);
        } else {
          return updateCategory(id, { is_active: action === 'activate' });
        }
      });

      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: `${selectedCategories.length} categories ${action}d successfully.`
      });
      
      setSelectedCategories([]);
      refetch();
    } catch (error) {
      console.error('Bulk action error:', error);
    }
  };

  const exportCategories = () => {
    const csvContent = [
      ['ID', 'English Name', 'Arabic Name', 'Slug', 'Status', 'Level'],
      ...flatCategories.map(cat => [
        cat.id,
        cat.name_en,
        cat.name_ar,
        cat.slug,
        cat.is_active ? 'Active' : 'Inactive',
        cat.level === 0 ? 'Parent' : 'Subcategory'
      ])
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map(category => (
      <div key={category.id} className="space-y-2">
        <Card className={`${level > 0 ? (isRTL ? 'mr-8' : 'ml-8') : ''} hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={cn("flex items-center space-x-3", isRTL && "flex-row-reverse space-x-reverse")}>
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category.id]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                    }
                  }}
                />
                {level > 0 ? (
                  <Folder className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <FolderOpen className="h-4 w-4 text-primary" />
                )}
                <div className={cn(isRTL ? "text-right" : "text-left")}>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{category.name_en}</h4>
                    <Badge variant={category.is_active ? "default" : "secondary"} className="text-xs">
                      {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.name_ar}</p>
                  <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
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

  const renderTableView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Categories Table</CardTitle>
        <CardDescription>All categories in a flat table structure</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCategories.length === flatCategories.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories(flatCategories.map(cat => cat.id));
                    } else {
                      setSelectedCategories([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Arabic Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flatCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category.id]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {category.level > 0 && (
                      <span className="text-muted-foreground ml-4">└─</span>
                    )}
                    <div>
                      <div className="font-medium">{category.name_en}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{category.name_ar}</TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{category.slug}</code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {category.level === 0 ? 'Parent' : 'Subcategory'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

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
      <AdminPageContainer
        title="Category Management"
        description="Access Restricted"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-warning mb-6" />
          <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You need admin privileges to access category management. 
            {userProfile ? ` Your current role is: ${userProfile.role}` : ' Please ensure you are logged in with an admin account.'}
          </p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer
      title="Category Management"
      description="Manage and organize service categories and subcategories"
      headerActions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update category information' : 'Add a new category to the system'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_en">English Name</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                    placeholder="Enter English name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_ar">Arabic Name</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                    placeholder="Enter Arabic name"
                    dir="rtl"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug" 
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  placeholder="category-slug"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL-friendly identifier (lowercase, hyphens allowed)
                </p>
              </div>

              <div>
                <Label htmlFor="parent_id">Parent Category (Optional)</Label>
                <Select
                  value={formData.parent_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Parent (Top Level)</SelectItem>
                    {categories?.filter(cat => cat.id !== editingCategory?.id).map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active Status</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Categories</CardDescription>
              <CardTitle className="text-2xl">{analytics.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Parent Categories</CardDescription>
              <CardTitle className="text-2xl">{analytics.parentCategories}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Subcategories</CardDescription>
              <CardTitle className="text-2xl">{analytics.subcategories}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-2xl text-green-600">{analytics.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Inactive</CardDescription>
              <CardTitle className="text-2xl text-red-600">{analytics.inactive}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'tree' ? 'table' : 'tree')}
          >
            {viewMode === 'tree' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            {viewMode === 'tree' ? 'Table View' : 'Tree View'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportCategories}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCategories.length} categories selected
              </span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                >
                  Activate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  Deactivate
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </CardContent>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Categories Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'No categories match your current filters.' 
                : 'Start by creating your first category.'}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {viewMode === 'tree' ? renderCategoryTree(filteredCategories) : renderTableView()}
        </div>
      )}
    </AdminPageContainer>
  );
};
