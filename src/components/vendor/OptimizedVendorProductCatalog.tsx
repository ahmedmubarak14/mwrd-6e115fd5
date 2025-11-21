import { useState, useMemo } from 'react';
import { Plus, Search, Grid, List, Edit, Trash2, Eye, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useVendorProducts } from '@/hooks/useVendorProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { cn } from '@/lib/utils';

// Enhanced components
import { ErrorRecovery } from '@/components/ui/error-recovery';
import { MobilePageWrapper, MobileOptimizedInput, MobileGrid, MobileStack, MobileActionSheet } from '@/components/ui/mobile';

// Forms
import { EnhancedProductForm } from './EnhancedProductForm';
import { ProductImageGallery } from './ProductImageGallery';

export const OptimizedVendorProductCatalog = () => {
  const { products, categories, loading, deleteProduct } = useVendorProducts();
  const { t, isRTL } = useLanguage();
  const { isMobile } = useMobileDetection();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState<string | null>(null);

  // Memoized filtered products for performance
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'out_of_stock': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency || 'SAR'
    }).format(price);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm(t('products.confirmDelete'))) {
      await deleteProduct(productId);
    }
  };

  // Mobile action sheet for product actions
  const getProductActions = (product: any) => [
    {
      id: 'view',
      label: t('products.viewImages'),
      icon: Eye,
      onClick: () => setShowImageDialog(product.id),
    },
    {
      id: 'edit',
      label: t('products.edit'),
      icon: Edit,
      onClick: () => setEditingProduct(product),
    },
    {
      id: 'delete',
      label: t('products.delete'),
      icon: Trash2,
      onClick: () => handleDeleteProduct(product.id),
      variant: 'destructive' as const,
    },
  ];

  // Loading state with skeletons
  if (loading) {
    return (
      <MobilePageWrapper enablePullToRefresh onRefresh={() => window.location.reload()}>
        <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className={cn("flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center", isRTL && "flex-row-reverse")}>
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
          
          <div className="flex gap-4">
            <div className="h-12 flex-1 bg-muted animate-pulse rounded" />
            <div className="h-12 w-32 bg-muted animate-pulse rounded" />
          </div>
          
          <MobileGrid cols={isMobile ? 1 : 3} gap="md">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted animate-pulse rounded w-16" />
                    <div className="h-4 bg-muted animate-pulse rounded w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </MobileGrid>
        </div>
      </MobilePageWrapper>
    );
  }

  const content = (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center", isRTL && "flex-row-reverse")}>
        <div>
          <h1 className="text-2xl font-bold">{t('products.catalog')}</h1>
          <p className="text-muted-foreground">{t('products.catalogDesc')}</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('products.addProduct')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('products.addNewProduct')}</DialogTitle>
            </DialogHeader>
            <EnhancedProductForm
              onSuccess={() => setShowAddDialog(false)}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className={cn("absolute top-3 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
          <MobileOptimizedInput
            placeholder={t('products.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(isRTL ? "pr-10" : "pl-10")}
          />
        </div>
        
        <div className={cn("flex gap-4 items-center justify-between", isRTL && "flex-row-reverse")}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 h-12 px-4 text-base border-2 rounded-xl bg-background"
          >
            <option value="all">{t('products.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name_en}>
                {isRTL ? category.name_ar : category.name_en}
              </option>
            ))}
          </select>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('products.noProducts')}</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all' 
                    ? t('products.noMatchingProducts')
                    : t('products.addFirstProduct')
                  }
                </p>
              </div>
              {!searchTerm && selectedCategory === 'all' && (
                <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('products.addFirstProduct')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <MobileGrid 
          cols={viewMode === 'grid' ? (isMobile ? 1 : 3) : 1} 
          gap="md"
        >
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {viewMode === 'grid' ? (
                <>
                  <div className="relative aspect-square bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary">
                        {t('products.featured')}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className={cn("flex justify-between items-start", isRTL && "flex-row-reverse")}>
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <Badge className={getStatusColor(product.status)}>
                          {t(`products.status.${product.status}`)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      
                      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                        <span className="font-bold text-primary">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t('products.stock')}: {product.stock_quantity}
                        </span>
                      </div>
                      
                      {isMobile ? (
                        <MobileActionSheet
                          actions={getProductActions(product)}
                          trigger={
                            <Button variant="outline" className="w-full">
                              {t('products.actions')}
                            </Button>
                          }
                        />
                      ) : (
                        <div className={cn("flex gap-2 pt-2", isRTL && "flex-row-reverse")}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowImageDialog(product.id)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
                    <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className={cn("flex justify-between items-start", isRTL && "flex-row-reverse")}>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                          <Badge className={getStatusColor(product.status)}>
                            {t(`products.status.${product.status}`)}
                          </Badge>
                          {product.featured && (
                            <Badge className="bg-primary">
                              {t('products.featured')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                      
                      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                        <span className="font-bold text-primary">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        
                        {isMobile ? (
                          <MobileActionSheet
                            actions={getProductActions(product)}
                            trigger={
                              <Button size="sm" variant="outline">
                                {t('products.actions')}
                              </Button>
                            }
                          />
                        ) : (
                          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                            <Button size="sm" variant="outline" onClick={() => setShowImageDialog(product.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </MobileGrid>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('products.editProduct')}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <EnhancedProductForm
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog open={!!showImageDialog} onOpenChange={() => setShowImageDialog(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t('products.productImages')}</DialogTitle>
          </DialogHeader>
          {showImageDialog && (
            <ProductImageGallery
              product={filteredProducts.find(p => p.id === showImageDialog)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <MobilePageWrapper 
      enablePullToRefresh 
      onRefresh={async () => window.location.reload()}
    >
      {content}
    </MobilePageWrapper>
  );
};