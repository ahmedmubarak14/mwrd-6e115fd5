import { useState } from 'react';
import { Plus, Search, Filter, Grid, List, Edit, Trash2, Eye, Camera, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVendorProducts } from '@/hooks/useVendorProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ProductForm } from './ProductForm';
import { ProductImageGallery } from './ProductImageGallery';

export const VendorProductCatalog = () => {
  const { products, categories, loading, deleteProduct } = useVendorProducts();
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState<string | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    if (window.confirm(t('products.confirmDelete') || 'Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center", isRTL && "flex-row-reverse")}>
        <div>
          <h1 className="text-2xl font-bold">{t('products.catalog') || 'Product Catalog'}</h1>
          <p className="text-muted-foreground">{t('products.catalogDesc') || 'Manage your product inventory and showcase your offerings'}</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('products.addProduct') || 'Add Product'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('products.addNewProduct') || 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSuccess={() => setShowAddDialog(false)}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className={cn("flex flex-col sm:flex-row gap-4 items-center justify-between", isRTL && "flex-row-reverse")}>
        <div className={cn("flex gap-4 flex-1 max-w-md", isRTL && "flex-row-reverse")}>
          <div className="relative flex-1">
            <Search className={cn("absolute top-3 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
            <Input
              placeholder={t('products.searchPlaceholder') || 'Search products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(isRTL ? "pr-10" : "pl-10")}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('products.allCategories') || 'All Categories'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('products.allCategories') || 'All Categories'}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name_en}>
                  {isRTL ? category.name_ar : category.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
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

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('products.noProducts') || 'No Products Found'}</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all' 
                    ? (t('products.noMatchingProducts') || 'No products match your current filters')
                    : (t('products.addFirstProduct') || 'Add your first product to get started')
                  }
                </p>
              </div>
              {!searchTerm && selectedCategory === 'all' && (
                <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('products.addFirstProduct') || 'Add Your First Product'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        )}>
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
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary">
                        {t('products.featured') || 'Featured'}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className={cn("flex justify-between items-start", isRTL && "flex-row-reverse")}>
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <Badge className={getStatusColor(product.status)}>
                          {t(`products.status.${product.status}`) || product.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      
                      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                        <span className="font-bold text-primary">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t('products.stock') || 'Stock'}: {product.stock_quantity}
                        </span>
                      </div>
                      
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
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="h-6 w-6 text-muted-foreground" />
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
                            {t(`products.status.${product.status}`) || product.status}
                          </Badge>
                          {product.featured && (
                            <Badge className="bg-primary">
                              {t('products.featured') || 'Featured'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                      
                      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                        <span className="font-bold text-primary">
                          {formatPrice(product.price, product.currency)}
                        </span>
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('products.editProduct') || 'Edit Product'}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
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
            <DialogTitle>{t('products.productImages') || 'Product Images'}</DialogTitle>
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
};