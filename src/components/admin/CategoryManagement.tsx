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
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, AlertTriangle, Search, Filter, Download, Grid, List, MoreHorizontal, Folder, FolderOpen, Expand, Minimize } from 'lucide-react';
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
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
        title: t('admin.categoryManagement.accessDenied'),
        description: t('admin.categoryManagement.needAdminPrivileges'),
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
          description: t('admin.categoryManagement.categoryUpdated')
        });
      } else {
        await createCategory(formData);
        toast({
          title: t('common.success'), 
          description: t('admin.categoryManagement.categoryCreated')
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
        title: t('admin.categoryManagement.accessDenied'),
        description: t('admin.categoryManagement.needAdminPrivilegesDelete'),
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(t('admin.categoryManagement.deleteCategoryConfirm'))) {
      try {
        await deleteCategory(id);
        toast({
          title: t('common.success'),
          description: t('admin.categoryManagement.categoryDeleted')
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
        title: t('admin.categoryManagement.accessDenied'),
        description: t('admin.categoryManagement.needAdminPrivilegesEdit'),
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
        title: t('common.success'),
        description: `${selectedCategories.length} ${t('admin.categoryManagement.bulkActionSuccess').replace('{action}', action)}`
      });
      
      setSelectedCategories([]);
      refetch();
    } catch (error) {
      console.error('Bulk action error:', error);
    }
  };

  const exportCategories = () => {
    const csvContent = [
      [
        t('admin.categoryManagement.csvHeaders.id'),
        t('admin.categoryManagement.csvHeaders.englishName'),
        t('admin.categoryManagement.csvHeaders.arabicName'),
        t('admin.categoryManagement.csvHeaders.slug'),
        t('admin.categoryManagement.csvHeaders.status'),
        t('admin.categoryManagement.csvHeaders.level')
      ],
      ...flatCategories.map(cat => [
        cat.id,
        cat.name_en,
        cat.name_ar,
        cat.slug,
        cat.is_active ? t('admin.categoryManagement.active') : t('admin.categoryManagement.inactive'),
        cat.level === 0 ? t('admin.categoryManagement.parent') : t('admin.categoryManagement.subcategory')
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

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const expandAllCategories = () => {
    const allParentIds = categories?.filter(cat => cat.children && cat.children.length > 0).map(cat => cat.id) || [];
    setExpandedCategories(allParentIds);
  };

  const collapseAllCategories = () => {
    setExpandedCategories([]);
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map((category, index) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.includes(category.id);
      const childrenCount = category.children?.length || 0;
      const isLastInLevel = index === cats.length - 1;

      return (
        <div key={category.id} className="relative">
          {/* Connecting Lines */}
          {level > 0 && (
            <>
              {/* Vertical line from parent */}
              <div className="absolute left-6 -top-4 w-px h-4 bg-border"></div>
              {/* Horizontal line to item */}
              <div className="absolute left-6 top-6 w-4 h-px bg-border"></div>
              {/* Vertical line continuing down (if not last item) */}
              {!isLastInLevel && (
                <div className="absolute left-6 top-6 w-px h-full bg-border"></div>
              )}
            </>
          )}

          <div className={cn(
            "relative mb-3",
            level > 0 && "ml-10"
          )}>
            {/* Main Category Card */}
            <Card className={cn(
              "group transition-all duration-200 border-l-4",
              hasChildren && "cursor-pointer hover:shadow-md",
              category.is_active 
                ? "border-l-green-500 bg-green-50/30 dark:bg-green-950/20" 
                : "border-l-gray-400 bg-gray-50/30 dark:bg-gray-950/20",
              isExpanded && hasChildren && "shadow-md"
            )}>
              <CardContent className="p-4">
                <div 
                  className={cn("flex items-start justify-between gap-4", isRTL && "flex-row-reverse")}
                  onClick={hasChildren ? () => toggleCategoryExpansion(category.id) : undefined}
                >
                  {/* Left Section */}
                  <div className={cn("flex items-start gap-3 flex-1", isRTL && "flex-row-reverse")}>
                    {/* Checkbox */}
                    <div className="pt-1">
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="transition-colors"
                      />
                    </div>
                    
                    {/* Expand/Collapse Button */}
                    <div className="pt-1">
                      {hasChildren ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-muted transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategoryExpansion(category.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className={cn(
                              "h-4 w-4 transition-transform duration-200", 
                              isRTL && "transform rotate-180"
                            )} />
                          )}
                        </Button>
                      ) : (
                        <div className="w-6 h-6 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Category Icon */}
                    <div className="pt-1">
                      {level > 0 ? (
                        <Folder className="h-5 w-5 text-muted-foreground" />
                      ) : hasChildren ? (
                        isExpanded ? (
                          <FolderOpen className="h-5 w-5 text-primary" />
                        ) : (
                          <Folder className="h-5 w-5 text-primary" />
                        )
                      ) : (
                        <Folder className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Category Information */}
                    <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
                      {/* Primary Info Row */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-foreground truncate">{category.name_en}</h4>
                        <Badge 
                          variant={category.is_active ? "default" : "secondary"} 
                          className="text-xs shrink-0"
                         >
                           {category.is_active ? t('admin.categoryManagement.active') : t('admin.categoryManagement.inactive')}
                         </Badge>
                        {hasChildren && (
                           <Badge variant="outline" className="text-xs shrink-0">
                             {childrenCount} {childrenCount !== 1 ? t('admin.categoryManagement.labels.childrenPlural') : t('admin.categoryManagement.labels.children')}
                           </Badge>
                        )}
                      </div>
                      
                      {/* Secondary Info */}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground truncate">{category.name_ar}</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {category.slug}
                          </code>
                           {level > 0 && (
                             <span className="text-xs text-muted-foreground">
                               {t('admin.categoryManagement.subcategory')}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={cn(
                    "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0",
                    isRTL && "flex-row-reverse"
                  )}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(category);
                      }}
                      disabled={!isAdmin}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.id);
                      }}
                      disabled={!isAdmin}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Subcategories - Only show if expanded */}
          {hasChildren && isExpanded && (
            <div className="animate-accordion-down overflow-hidden">
              <div className="pt-2">
                {renderCategoryTree(category.children, level + 1)}
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderTableView = () => (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              {t('admin.categoryManagement.categoriesTable')}
            </CardTitle>
            <CardDescription>
              {t('admin.categoryManagement.comprehensiveView')}
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            {flatCategories.length} {t('admin.categoryManagement.total')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="w-12 pl-6">
                  <Checkbox
                    checked={selectedCategories.length === flatCategories.length && flatCategories.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories(flatCategories.map(cat => cat.id));
                      } else {
                        setSelectedCategories([]);
                      }
                    }}
                    className="transition-colors"
                  />
                </TableHead>
                <TableHead className="font-semibold">{t('admin.categoryManagement.categoryHierarchy')}</TableHead>
                <TableHead className="font-semibold">{t('admin.categoryManagement.arabicName')}</TableHead>
                <TableHead className="font-semibold">{t('admin.categoryManagement.slug')}</TableHead>
                <TableHead className="font-semibold text-center">{t('admin.categoryManagement.type')}</TableHead>
                <TableHead className="font-semibold text-center">{t('admin.categoryManagement.status')}</TableHead>
                <TableHead className="font-semibold text-center">{t('admin.categoryManagement.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flatCategories.map((category, index) => {
                const isActive = category.is_active;
                const isParent = category.level === 0;
                const hasChildren = category.children && category.children.length > 0;
                
                return (
                  <TableRow 
                    key={category.id} 
                    className={cn(
                      "group transition-colors hover:bg-muted/30",
                      index % 2 === 0 ? "bg-background" : "bg-muted/10",
                      !isActive && "opacity-75"
                    )}
                  >
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                        className="transition-colors"
                      />
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        {/* Hierarchy Indicator */}
                        <div className="flex items-center gap-1">
                          {category.level > 0 && (
                            <>
                              <div className="flex items-center text-muted-foreground">
                                {Array.from({ length: category.level }).map((_, i) => (
                                  <div key={i} className="w-4 h-px bg-border mx-1"></div>
                                ))}
                                <ChevronRight className="h-3 w-3" />
                              </div>
                            </>
                          )}
                          
                          {/* Category Icon */}
                          {isParent ? (
                            hasChildren ? (
                              <FolderOpen className="h-4 w-4 text-primary" />
                            ) : (
                              <Folder className="h-4 w-4 text-primary" />
                            )
                          ) : (
                            <Folder className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        
                        {/* Category Name and Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground truncate">
                              {category.name_en}
                            </span>
                            {hasChildren && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {category.children?.length} sub{(category.children?.length || 0) !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          {category.level > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Subcategory of parent
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="font-medium text-right" dir="rtl">
                        {category.name_ar}
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <code className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono",
                        "bg-muted border transition-colors",
                        "hover:bg-muted/80"
                      )}>
                        {category.slug}
                      </code>
                    </TableCell>
                    
                    <TableCell className="py-4 text-center">
                      <Badge 
                        variant={isParent ? "default" : "secondary"}
                        className="font-medium"
                       >
                         {isParent ? t('admin.categoryManagement.parent') : t('admin.categoryManagement.subcategory')}
                       </Badge>
                    </TableCell>
                    
                    <TableCell className="py-4 text-center">
                      <Badge 
                        variant={isActive ? "default" : "secondary"}
                        className={cn(
                          "font-medium transition-colors",
                          isActive 
                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100" 
                            : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        )}
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-1.5",
                          isActive ? "bg-green-500" : "bg-gray-400"
                        )}></div>
                         {isActive ? t('admin.categoryManagement.active') : t('admin.categoryManagement.inactive')}
                       </Badge>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          disabled={!isAdmin}
                          className="h-7 w-7 p-0 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          disabled={!isAdmin}
                          className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {flatCategories.length === 0 && (
          <div className="p-12 text-center border-t">
            <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('admin.categoryManagement.noCategoriesInTable')}</h3>
            <p className="text-muted-foreground">
              {t('admin.categoryManagement.switchToTreeView')}
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Table Footer with Summary */}
      {flatCategories.length > 0 && (
        <div className="border-t bg-muted/20 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{t('admin.categoryManagement.showingCategories')} {flatCategories.length} {t('admin.categoryManagement.categoriesSelected').split(' ')[0]}</span>
              <span>•</span>
              <span>{analytics?.parentCategories || 0} {t('admin.categoryManagement.parentCategories').toLowerCase()}</span>
              <span>•</span>
              <span>{analytics?.subcategories || 0} {t('admin.categoryManagement.subcategories').toLowerCase()}</span>
            </div>
            {selectedCategories.length > 0 && (
              <span className="font-medium text-primary">
                {selectedCategories.length} {t('admin.categoryManagement.selected')}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        {t('admin.categoryManagement.loadingCategories')}
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
      title={t('admin.categoryManagement.title')}
      description={t('admin.categoryManagement.description')}
      headerActions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.categoryManagement.addCategory')}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? t('admin.categoryManagement.editCategoryTitle') : t('admin.categoryManagement.createCategoryTitle')}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? t('admin.categoryManagement.updateCategoryDescription') : t('admin.categoryManagement.addCategoryDescription')}
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
                <Label htmlFor="parent_id">{t('admin.categoryManagement.form.parentCategory')}</Label>
                <Select
                  value={formData.parent_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.categoryManagement.form.selectParent')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('admin.categoryManagement.form.noParent')}</SelectItem>
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
                <Label htmlFor="is_active">{t('admin.categoryManagement.form.activeStatus')}</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('admin.categoryManagement.form.cancel')}
                </Button>
                <Button type="submit">
                  {editingCategory ? t('admin.categoryManagement.form.updateCategory') : t('admin.categoryManagement.form.createCategory')}
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
              <CardDescription>{t('admin.categoryManagement.totalCategories')}</CardDescription>
              <CardTitle className="text-2xl">{analytics.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('admin.categoryManagement.parentCategories')}</CardDescription>
              <CardTitle className="text-2xl">{analytics.parentCategories}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('admin.categoryManagement.subcategories')}</CardDescription>
              <CardTitle className="text-2xl">{analytics.subcategories}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('admin.categoryManagement.active')}</CardDescription>
              <CardTitle className="text-2xl text-green-600">{analytics.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('admin.categoryManagement.inactive')}</CardDescription>
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
            placeholder={t('admin.categoryManagement.search.placeholder')}
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
            <SelectItem value="all">{t('admin.categoryManagement.search.allStatus')}</SelectItem>
            <SelectItem value="active">{t('admin.categoryManagement.search.activeOnly')}</SelectItem>
            <SelectItem value="inactive">{t('admin.categoryManagement.search.inactiveOnly')}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          {viewMode === 'tree' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={expandAllCategories}
                disabled={expandedCategories.length === (categories?.filter(cat => cat.children && cat.children.length > 0).length || 0)}
              >
                <Expand className="h-4 w-4 mr-2" />
                {t('admin.categoryManagement.expandAll')}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAllCategories}
                disabled={expandedCategories.length === 0}
              >
                <Minimize className="h-4 w-4 mr-2" />
                {t('admin.categoryManagement.collapseAll')}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'tree' ? 'table' : 'tree')}
          >
            {viewMode === 'tree' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            {viewMode === 'tree' ? t('admin.categoryManagement.tableView') : t('admin.categoryManagement.treeView')}
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportCategories}>
            <Download className="h-4 w-4 mr-2" />
            {t('admin.categoryManagement.export')}
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
                  {t('admin.categoryManagement.bulkActions.activate')}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  {t('admin.categoryManagement.bulkActions.deactivate')}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  {t('admin.categoryManagement.bulkActions.delete')}
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
            <p className="text-muted-foreground">{t('admin.categoryManagement.emptyStates.loading')}</p>
          </CardContent>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('admin.categoryManagement.emptyStates.noCategoriesFound')}</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? t('admin.categoryManagement.emptyStates.noMatchingFilters')
                : t('admin.categoryManagement.emptyStates.createFirst')}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                {t('admin.categoryManagement.emptyStates.clearFilters')}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {viewMode === 'tree' ? (
            <div className="space-y-4">
              {renderCategoryTree(filteredCategories)}
            </div>
          ) : (
            renderTableView()
          )}
        </div>
      )}
    </AdminPageContainer>
  );
};
