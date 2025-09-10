import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  DollarSign, 
  Tag, 
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  leadTime: string;
  images: string[];
  tags: string[];
  variants?: ProductVariant[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  attributes: Record<string, string>;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  sku: string;
  price: string;
  currency: string;
  stock: string;
  leadTime: string;
  tags: string;
  status: 'active' | 'inactive' | 'draft';
}

const PRODUCT_CATEGORIES = [
  'Construction Materials',
  'Electrical Equipment',
  'Plumbing & HVAC',
  'Interior Design',
  'Landscaping',
  'Cleaning Supplies',
  'Security Equipment',
  'IT & Technology',
  'Catering Equipment',
  'Transportation',
  'Professional Services',
  'Marketing Materials'
];

const CURRENCIES = ['SAR', 'USD', 'EUR', 'GBP'];

export const ProductCatalog: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Office Chairs',
      description: 'Ergonomic office chairs with lumbar support and adjustable height',
      category: 'Interior Design',
      sku: 'CHAIR-001',
      price: 450,
      currency: 'SAR',
      stock: 25,
      leadTime: '3-5 days',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'],
      tags: ['office', 'furniture', 'ergonomic'],
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'LED Panel Lights',
      description: 'Energy-efficient LED panel lights for commercial spaces',
      category: 'Electrical Equipment',
      sku: 'LED-002',
      price: 120,
      currency: 'SAR',
      stock: 50,
      leadTime: '2-3 days',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'],
      tags: ['lighting', 'led', 'commercial'],
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    sku: '',
    price: '',
    currency: 'SAR',
    stock: '',
    leadTime: '',
    tags: '',
    status: 'active'
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      sku: '',
      price: '',
      currency: 'SAR',
      stock: '',
      leadTime: '',
      tags: '',
      status: 'active'
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      sku: product.sku,
      price: product.price.toString(),
      currency: product.currency,
      stock: product.stock.toString(),
      leadTime: product.leadTime,
      tags: product.tags.join(', '),
      status: product.status
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.category || !formData.sku) {
      toast({
        title: t('common.error'),
        description: t('forms.requiredFields'),
        variant: 'destructive'
      });
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      sku: formData.sku,
      price: formData.price ? parseFloat(formData.price) : 0,
      currency: formData.currency,
      stock: parseInt(formData.stock) || 0,
      leadTime: formData.leadTime,
      images: editingProduct?.images || [],
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      status: formData.status,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
      toast({
        title: t('common.success'),
        description: t('vendor.products.updated')
      });
    } else {
      setProducts(prev => [...prev, productData]);
      toast({
        title: t('common.success'),
        description: t('vendor.products.created')
      });
    }

    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: t('common.success'),
      description: t('vendor.products.deleted')
    });
  };

  const handleToggleStatus = (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, status: newStatus } : p
    ));
    toast({
      title: t('vendor.products.productUpdated'),
      description: t('vendor.products.statusChanged', { status: t(`vendor.products.${newStatus}`) })
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL && "text-right")}>
          <h1 className="text-3xl font-bold">{t('vendor.products.title')}</h1>
          <p className="text-muted-foreground">{t('vendor.products.description')}</p>
        </div>
        <Button onClick={handleCreateProduct} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('vendor.products.addProduct')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className={cn("flex flex-col sm:flex-row gap-4", isRTL && "flex-row-reverse")}>
            <div className="flex-1">
              <div className="relative">
                <Search className={cn("absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4", isRTL ? "right-3" : "left-3")} />
                <Input
                  placeholder={t('vendor.products.searchProducts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(isRTL ? "pr-10" : "pl-10")}
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('vendor.products.filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {PRODUCT_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('vendor.products.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="active">{t('common.active')}</SelectItem>
                <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                <SelectItem value="draft">{t('common.draft')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge className={cn("gap-1", getStatusColor(product.status))}>
                  {getStatusIcon(product.status)}
                  {t(`common.${product.status}`)}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                    title={t('vendor.products.editProduct')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(product)}
                    title={product.status === 'active' ? t('vendor.products.setInactive') : t('vendor.products.setActive')}
                  >
                    {product.status === 'active' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    title={t('vendor.products.deleteProduct')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('vendor.products.sku')}</span>
                  <span className="text-sm font-mono">{product.sku}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('vendor.products.price')}</span>
                  <span className="text-lg font-bold">{product.price} {product.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('vendor.products.stock')}</span>
                  <span className="text-sm">{product.stock} {t('vendor.products.units')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('vendor.products.leadTime')}</span>
                  <span className="text-sm">{product.leadTime}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('vendor.products.noProducts')}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {t('vendor.products.noProductsDescription')}
            </p>
            <Button onClick={handleCreateProduct}>
              <Plus className="h-4 w-4 mr-2" />
              {t('vendor.products.addFirstProduct')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Form Dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? t('vendor.products.editProduct') : t('vendor.products.addProduct')}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? t('vendor.products.editProductDescription') : t('vendor.products.addProductDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('vendor.products.productName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('vendor.products.productNamePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="sku">{t('vendor.products.sku')} *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  placeholder={t('vendor.products.skuPlaceholder')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">{t('vendor.products.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('vendor.products.descriptionPlaceholder')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">{t('vendor.products.category')} *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('vendor.products.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">{t('vendor.products.price')} ({t('common.optional')})</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">{t('vendor.products.currency')}</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(currency => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="stock">{t('vendor.products.stock')}</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="leadTime">{t('vendor.products.leadTime')}</Label>
                <Input
                  id="leadTime"
                  value={formData.leadTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, leadTime: e.target.value }))}
                  placeholder={t('vendor.products.leadTimePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="status">{t('vendor.products.status')}</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('vendor.products.active')}</SelectItem>
                    <SelectItem value="inactive">{t('vendor.products.inactive')}</SelectItem>
                    <SelectItem value="draft">{t('vendor.products.draft')}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('vendor.products.draftNote')}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">{t('vendor.products.tags')}</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder={t('vendor.products.tagsPlaceholder')}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('vendor.products.tagsHelp')}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowProductForm(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? t('common.update') : t('common.create')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
