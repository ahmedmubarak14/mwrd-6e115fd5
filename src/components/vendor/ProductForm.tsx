import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus } from 'lucide-react';
import { useVendorProducts, VendorProduct } from '@/hooks/useVendorProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  sku: z.string().optional(),
  stock_quantity: z.number().min(0, 'Stock quantity cannot be negative'),
  min_order_quantity: z.number().min(1, 'Minimum order quantity must be at least 1'),
  currency: z.string().default('SAR'),
  unit: z.string().default('piece'),
  weight_kg: z.number().optional(),
  dimensions_cm: z.string().optional(),
  warranty_months: z.number().optional(),
  delivery_time_days: z.number().min(1, 'Delivery time must be at least 1 day'),
  status: z.enum(['active', 'inactive', 'out_of_stock']).default('active'),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: VendorProduct;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const { categories, createProduct, updateProduct, uploadProductImage, submitting } = useVendorProducts();
  const { t, isRTL } = useLanguage();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [features, setFeatures] = useState<string[]>(product?.features || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      subcategory: product.subcategory || '',
      sku: product.sku || '',
      stock_quantity: product.stock_quantity,
      min_order_quantity: product.min_order_quantity,
      currency: product.currency,
      unit: product.unit,
      weight_kg: product.weight_kg,
      dimensions_cm: product.dimensions_cm || '',
      warranty_months: product.warranty_months,
      delivery_time_days: product.delivery_time_days,
      status: product.status,
      featured: product.featured,
    } : {
      currency: 'SAR',
      unit: 'piece',
      stock_quantity: 0,
      min_order_quantity: 1,
      delivery_time_days: 7,
      status: 'active',
      featured: false,
    }
  });

  const watchedStatus = watch('status');
  const watchedFeatured = watch('featured');

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        subcategory: data.subcategory,
        sku: data.sku,
        stock_quantity: data.stock_quantity,
        min_order_quantity: data.min_order_quantity,
        currency: data.currency,
        unit: data.unit,
        weight_kg: data.weight_kg,
        dimensions_cm: data.dimensions_cm,
        warranty_months: data.warranty_months,
        delivery_time_days: data.delivery_time_days,
        status: data.status,
        featured: data.featured,
        images,
        features,
        tags,
        specifications: {}, // Can be extended later for complex specifications
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }
      
      onSuccess();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadProductImage(file, product?.id);
      setImages(prev => [...prev, imageUrl]);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Basic Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t('products.basicInfo') || 'Basic Information'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('products.productName') || 'Product Name'} *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('products.productNamePlaceholder') || 'Enter product name'}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">{t('products.sku') || 'SKU'}</Label>
              <Input
                id="sku"
                {...register('sku')}
                placeholder={t('products.skuPlaceholder') || 'Optional product code'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('products.description') || 'Description'}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('products.descriptionPlaceholder') || 'Describe your product...'}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">{t('products.category') || 'Category'} *</Label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('products.selectCategory') || 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name_en}>
                      {isRTL ? category.name_ar : category.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">{t('products.subcategory') || 'Subcategory'}</Label>
              <Input
                id="subcategory"
                {...register('subcategory')}
                placeholder={t('products.subcategoryPlaceholder') || 'Optional subcategory'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing and Inventory */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t('products.pricingInventory') || 'Pricing & Inventory'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('products.price') || 'Price'} *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t('products.currency') || 'Currency'}</Label>
              <Select onValueChange={(value) => setValue('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">{t('products.unit') || 'Unit'}</Label>
              <Input
                id="unit"
                {...register('unit')}
                placeholder={t('products.unitPlaceholder') || 'e.g., piece, kg, meter'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">{t('products.stockQuantity') || 'Stock Quantity'}</Label>
              <Input
                id="stock_quantity"
                type="number"
                {...register('stock_quantity', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_order_quantity">{t('products.minOrderQuantity') || 'Minimum Order Quantity'}</Label>
              <Input
                id="min_order_quantity"
                type="number"
                {...register('min_order_quantity', { valueAsNumber: true })}
                placeholder="1"
              />
              {errors.min_order_quantity && <p className="text-sm text-destructive">{errors.min_order_quantity.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t('products.productImages') || 'Product Images'}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground text-center">
                {uploadingImage ? (t('products.uploading') || 'Uploading...') : (t('products.addImage') || 'Add Image')}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Features and Tags */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t('products.featuresAndTags') || 'Features & Tags'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('products.features') || 'Features'}</Label>
              <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder={t('products.addFeature') || 'Add a feature'}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {feature}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('products.tags') || 'Tags'}</Label>
              <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder={t('products.addTag') || 'Add a tag'}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    #{tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Properties & Settings */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">{t('products.propertiesSettings') || 'Properties & Settings'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight_kg">{t('products.weight') || 'Weight (kg)'}</Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.001"
                {...register('weight_kg', { valueAsNumber: true })}
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions_cm">{t('products.dimensions') || 'Dimensions (cm)'}</Label>
              <Input
                id="dimensions_cm"
                {...register('dimensions_cm')}
                placeholder="L x W x H"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty_months">{t('products.warranty') || 'Warranty (months)'}</Label>
              <Input
                id="warranty_months"
                type="number"
                {...register('warranty_months', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_time_days">{t('products.deliveryTime') || 'Delivery Time (days)'} *</Label>
              <Input
                id="delivery_time_days"
                type="number"
                {...register('delivery_time_days', { valueAsNumber: true })}
                placeholder="7"
              />
              {errors.delivery_time_days && <p className="text-sm text-destructive">{errors.delivery_time_days.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('products.status') || 'Status'}</Label>
              <Select onValueChange={(value: any) => setValue('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('products.status.active') || 'Active'}</SelectItem>
                  <SelectItem value="inactive">{t('products.status.inactive') || 'Inactive'}</SelectItem>
                  <SelectItem value="out_of_stock">{t('products.status.out_of_stock') || 'Out of Stock'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
            <Switch
              checked={watchedFeatured}
              onCheckedChange={(checked) => setValue('featured', checked)}
            />
            <Label>{t('products.featuredProduct') || 'Featured Product'}</Label>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className={cn("flex gap-4 justify-end", isRTL && "flex-row-reverse")}>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel') || 'Cancel'}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (t('common.saving') || 'Saving...') : (product ? (t('common.update') || 'Update') : (t('common.create') || 'Create'))}
        </Button>
      </div>
    </form>
  );
};