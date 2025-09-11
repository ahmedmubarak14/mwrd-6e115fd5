import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Plus, Save } from 'lucide-react';
import { useVendorProducts, VendorProduct } from '@/hooks/useVendorProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { cn } from '@/lib/utils';

// Enhanced components
import { MobileOptimizedInput, MobileStack } from '@/components/ui/mobile';
import { ErrorRecovery } from '@/components/ui/error-recovery';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Enhanced product validation schema
const productSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be less than 100 characters'),
  
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  
  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(999999, 'Price seems too high, please verify'),
  
  category: z.string()
    .min(1, 'Category is required'),
  
  subcategory: z.string().optional(),
  
  sku: z.string()
    .max(50, 'SKU must be less than 50 characters')
    .optional(),
  
  stock_quantity: z.number()
    .min(0, 'Stock quantity cannot be negative')
    .max(999999, 'Stock quantity seems too high'),
  
  min_order_quantity: z.number()
    .min(1, 'Minimum order quantity must be at least 1')
    .max(1000, 'Minimum order quantity seems too high'),
  
  currency: z.string().default('SAR'),
  unit: z.string().default('piece'),
  
  weight_kg: z.number()
    .min(0, 'Weight cannot be negative')
    .max(10000, 'Weight seems too high')
    .optional(),
  
  dimensions_cm: z.string()
    .max(50, 'Dimensions must be less than 50 characters')
    .optional(),
  
  warranty_months: z.number()
    .min(0, 'Warranty cannot be negative')
    .max(120, 'Warranty seems too long')
    .optional(),
  
  delivery_time_days: z.number()
    .min(1, 'Delivery time must be at least 1 day')
    .max(365, 'Delivery time seems too long'),
  
  status: z.enum(['active', 'inactive', 'out_of_stock']).default('active'),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface EnhancedProductFormProps {
  product?: VendorProduct;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EnhancedProductForm = ({ product, onSuccess, onCancel }: EnhancedProductFormProps) => {
  const { categories, createProduct, updateProduct, uploadProductImage, submitting } = useVendorProducts();
  const { t, isRTL } = useLanguage();
  const { isMobile } = useMobileDetection();
  
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [features, setFeatures] = useState<string[]>(product?.features || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    clearErrors,
    setError,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
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
      setFormError(null);
      
      // Additional validation
      if (images.length === 0) {
        setFormError(t('products.validation.imagesRequired') || 'At least one product image is required');
        return;
      }

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
        specifications: {},
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }
      
      onSuccess();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setFormError(t('products.validation.imageTooLarge') || 'Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFormError(t('products.validation.invalidImageType') || 'Please select a valid image file');
      return;
    }

    try {
      setUploadingImage(true);
      setFormError(null);
      const imageUrl = await uploadProductImage(file, product?.id);
      setImages(prev => [...prev, imageUrl]);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  if (submitting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-4">
          {product ? 
            (t('products.updating') || 'Updating product...') : 
            (t('products.creating') || 'Creating product...')
          }
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {formError && (
        <ErrorRecovery 
          error={formError}
          onRetry={() => setFormError(null)}
        />
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{t('products.basicInfo') || 'Basic Information'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('products.productName') || 'Product Name'} *</Label>
                <MobileOptimizedInput
                  {...register('name')}
                  placeholder={t('products.productNamePlaceholder') || 'Enter product name'}
                  error={errors.name?.message}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">{t('products.sku') || 'SKU'}</Label>
                <MobileOptimizedInput
                  {...register('sku')}
                  placeholder={t('products.skuPlaceholder') || 'Optional product code'}
                  error={errors.sku?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('products.description') || 'Description'}</Label>
              <Textarea
                {...register('description')}
                placeholder={t('products.descriptionPlaceholder') || 'Describe your product...'}
                rows={3}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t('products.category') || 'Category'} *</Label>
                <select
                  {...register('category')}
                  className="flex h-12 w-full rounded-xl border-2 bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{t('products.selectCategory') || 'Select category'}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name_en}>
                      {isRTL ? category.name_ar : category.name_en}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">{t('products.subcategory') || 'Subcategory'}</Label>
                <MobileOptimizedInput
                  {...register('subcategory')}
                  placeholder={t('products.subcategoryPlaceholder') || 'Optional subcategory'}
                  error={errors.subcategory?.message}
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
                <MobileOptimizedInput
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={errors.price?.message}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t('products.currency') || 'Currency'}</Label>
                <select
                  {...register('currency')}
                  className="flex h-12 w-full rounded-xl border-2 bg-background px-4 py-2 text-base"
                >
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">{t('products.unit') || 'Unit'}</Label>
                <MobileOptimizedInput
                  {...register('unit')}
                  placeholder={t('products.unitPlaceholder') || 'e.g., piece, kg, meter'}
                  error={errors.unit?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">{t('products.stockQuantity') || 'Stock Quantity'}</Label>
                <MobileOptimizedInput
                  {...register('stock_quantity', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                  error={errors.stock_quantity?.message}
                />
                {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_order_quantity">{t('products.minOrderQuantity') || 'Minimum Order Quantity'}</Label>
                <MobileOptimizedInput
                  {...register('min_order_quantity', { valueAsNumber: true })}
                  type="number"
                  placeholder="1"
                  error={errors.min_order_quantity?.message}
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
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground text-center px-2">
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
            {images.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t('products.validation.imagesRequired') || 'At least one product image is required'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Features and Tags */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{t('products.featuresAndTags') || 'Features & Tags'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">{t('products.features') || 'Features'}</h4>
                <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                  <MobileOptimizedInput
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder={t('products.addFeature') || 'Add a feature'}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} size="sm" className="px-3">
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

              <div className="space-y-3">
                <h4 className="font-medium">{t('products.tags') || 'Tags'}</h4>
                <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                  <MobileOptimizedInput
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={t('products.addTag') || 'Add a tag'}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm" className="px-3">
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

        {/* Settings */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{t('products.settings') || 'Settings'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">{t('products.status') || 'Status'}</Label>
                  <select
                    {...register('status')}
                    className="flex h-12 w-full rounded-xl border-2 bg-background px-4 py-2 text-base"
                  >
                    <option value="active">{t('products.status.active') || 'Active'}</option>
                    <option value="inactive">{t('products.status.inactive') || 'Inactive'}</option>
                    <option value="out_of_stock">{t('products.status.out_of_stock') || 'Out of Stock'}</option>
                  </select>
                  {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery_time_days">{t('products.deliveryTime') || 'Delivery Time (days)'} *</Label>
                  <MobileOptimizedInput
                    {...register('delivery_time_days', { valueAsNumber: true })}
                    type="number"
                    placeholder="7"
                    error={errors.delivery_time_days?.message}
                  />
                  {errors.delivery_time_days && <p className="text-sm text-destructive">{errors.delivery_time_days.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{t('products.featured') || 'Featured Product'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('products.featuredDesc') || 'Highlight this product in listings'}
                    </p>
                  </div>
                  <Switch
                    checked={watchedFeatured}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className={cn("flex gap-4 pt-6 border-t", isRTL && "flex-row-reverse")}>
        <Button
          type="submit"
          disabled={!isValid || images.length === 0}
          className="flex-1 gap-2"
        >
          <Save className="h-4 w-4" />
          {product ? (t('products.updateProduct') || 'Update Product') : (t('products.createProduct') || 'Create Product')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 gap-2"
        >
          <X className="h-4 w-4" />
          {t('common.cancel') || 'Cancel'}
        </Button>
      </div>
    </form>
  );
};