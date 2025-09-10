import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Search, 
  Package, 
  DollarSign, 
  Tag, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  ShoppingCart
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
  currency: string;
}

interface VendorProductCatalogViewProps {
  vendorId: string;
  onRequestQuote?: (product: Product) => void;
  onContactVendor?: () => void;
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

export const VendorProductCatalogView: React.FC<VendorProductCatalogViewProps> = ({
  vendorId,
  onRequestQuote,
  onContactVendor
}) => {
  const { t, isRTL } = useLanguage();
  
  // Mock data - in real implementation, this would fetch from API
  const [products] = useState<Product[]>([
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
    },
    {
      id: '3',
      name: 'Commercial Cleaning Supplies',
      description: 'Professional-grade cleaning supplies for office and commercial spaces',
      category: 'Cleaning Supplies',
      sku: 'CLEAN-003',
      price: 85,
      currency: 'SAR',
      stock: 100,
      leadTime: '1-2 days',
      images: ['https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4c1?w=300&h=200&fit=crop'],
      tags: ['cleaning', 'commercial', 'supplies'],
      status: 'active',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Package className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleRequestQuote = (product: Product) => {
    if (onRequestQuote) {
      onRequestQuote(product);
    }
  };

  const handleContactVendor = () => {
    if (onContactVendor) {
      onContactVendor();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL && "text-right")}>
          <h3 className="text-xl font-semibold">{t('vendor.products.title')}</h3>
          <p className="text-muted-foreground text-sm">
            {t('vendor.products.browseProducts')} ({filteredProducts.length} {t('vendor.products.products')})
          </p>
        </div>
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <Button variant="outline" size="sm" onClick={handleContactVendor}>
            <MessageCircle className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {t('vendor.products.contactVendor')}
          </Button>
        </div>
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
                <SelectItem value="active">{t('vendor.products.active')}</SelectItem>
                <SelectItem value="inactive">{t('vendor.products.inactive')}</SelectItem>
                <SelectItem value="draft">{t('vendor.products.draft')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('vendor.products.noProducts')}</h3>
            <p className="text-muted-foreground">{t('vendor.products.noProductsDescription')}</p>
          </CardContent>
        </Card>
      ) : (
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
                <div className={cn("absolute top-2", isRTL ? "left-2" : "right-2")}>
                  <Badge className={cn("gap-1", getStatusColor(product.status))}>
                    {getStatusIcon(product.status)}
                    {t(`vendor.products.${product.status}`)}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                    <span className="text-sm text-muted-foreground">{t('vendor.products.sku')}</span>
                    <span className="text-sm font-mono">{product.sku}</span>
                  </div>
                  <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                    <span className="text-sm text-muted-foreground">{t('vendor.products.price')}</span>
                    <span className="text-lg font-bold">{product.price} {product.currency}</span>
                  </div>
                  <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                    <span className="text-sm text-muted-foreground">{t('vendor.products.stock')}</span>
                    <span className="text-sm">{product.stock} {t('vendor.products.units')}</span>
                  </div>
                  <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
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
                  
                  {/* Action Buttons */}
                  <div className={cn("flex gap-2 pt-3", isRTL && "flex-row-reverse")}>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleRequestQuote(product)}
                    >
                      <ShoppingCart className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                      {t('vendor.products.requestQuote')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleContactVendor}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
