import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Eye,
  Grid3X3,
  List,
  Clock,
  Truck,
  Shield,
  Info
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { VendorProduct } from '@/hooks/useVendorProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface PublicVendorProductCatalogProps {
  vendorId: string;
  vendorName: string;
}

export const PublicVendorProductCatalog: React.FC<PublicVendorProductCatalogProps> = ({
  vendorId,
  vendorName
}) => {
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<VendorProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<VendorProduct | null>(null);

  useEffect(() => {
    fetchVendorProducts();
  }, [vendorId]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('vendor_products')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const productsData = data as VendorProduct[];
      setProducts(productsData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(productsData.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching vendor products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: number, currency: string) => {
    return isRTL ? `${price} ${currency}` : `${currency} ${price}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ProductCard = ({ product }: { product: VendorProduct }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="aspect-square relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {isArabic ? 'مميز' : 'Featured'}
          </Badge>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(product.status)}>
            {product.stock_quantity > 0 ? (isArabic ? 'متوفر' : 'In Stock') : (isArabic ? 'نفد المخزون' : 'Out of Stock')}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {isArabic ? `الحد الأدنى: ${product.min_order_quantity} ${product.unit}` : `Min order: ${product.min_order_quantity} ${product.unit}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              <span>{product.delivery_time_days} {isArabic ? 'أيام' : 'days'}</span>
            </div>
            {product.warranty_months && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>{product.warranty_months} {isArabic ? 'شهر ضمان' : 'months warranty'}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  {isArabic ? 'تفاصيل' : 'Details'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                </DialogHeader>
                <ProductDetailView product={product} />
              </DialogContent>
            </Dialog>
            
            <Button size="sm" className="flex-1">
              <Info className="h-4 w-4 mr-2" />
              {isArabic ? 'طلب عرض' : 'Request Quote'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductDetailView = ({ product }: { product: VendorProduct }) => (
    <div className="space-y-6">
      {/* Image Gallery */}
      {product.images && product.images.length > 0 && (
        <div className="space-y-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 2}`}
                  className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">{isArabic ? 'الوصف' : 'Description'}</h4>
            <p className="text-muted-foreground">{product.description || (isArabic ? 'لا يوجد وصف' : 'No description available')}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">{isArabic ? 'المميزات' : 'Features'}</h4>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">{isArabic ? 'معلومات المنتج' : 'Product Information'}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isArabic ? 'السعر' : 'Price'}:</span>
                <span className="font-medium">{formatPrice(product.price, product.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isArabic ? 'الفئة' : 'Category'}:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isArabic ? 'الكمية المتاحة' : 'Stock'}:</span>
                <span>{product.stock_quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isArabic ? 'الحد الأدنى للطلب' : 'Min Order'}:</span>
                <span>{product.min_order_quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isArabic ? 'وقت التسليم' : 'Delivery Time'}:</span>
                <span>{product.delivery_time_days} {isArabic ? 'أيام' : 'days'}</span>
              </div>
              {product.warranty_months && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isArabic ? 'فترة الضمان' : 'Warranty'}:</span>
                  <span>{product.warranty_months} {isArabic ? 'شهر' : 'months'}</span>
                </div>
              )}
            </div>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">{isArabic ? 'المواصفات' : 'Specifications'}</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            {isArabic ? `منتجات ${vendorName}` : `${vendorName} Products`}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? `${filteredProducts.length} منتج متاح` : `${filteredProducts.length} products available`}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? 'ابحث في المنتجات...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={isArabic ? 'جميع الفئات' : 'All Categories'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isArabic ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{isArabic ? 'الاسم' : 'Name'}</SelectItem>
                <SelectItem value="price_low">{isArabic ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</SelectItem>
                <SelectItem value="price_high">{isArabic ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</SelectItem>
                <SelectItem value="newest">{isArabic ? 'الأحدث' : 'Newest'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('name');
              }}
            >
              {isArabic ? 'مسح المرشحات' : 'Clear Filters'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      {filteredProducts.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title={isArabic ? 'لا توجد منتجات' : 'No products found'}
          description={isArabic ? 'لم يتم العثور على منتجات تطابق معايير البحث' : 'No products match your search criteria'}
        />
      )}
    </div>
  );
};