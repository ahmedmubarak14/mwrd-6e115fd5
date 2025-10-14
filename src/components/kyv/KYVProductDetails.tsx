import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KYVProductDetailsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onFileUpload: (field: string, file: File) => void;
}

export const KYVProductDetails: React.FC<KYVProductDetailsProps> = ({
  formData,
  onChange,
  onFileUpload,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product & Service Details</CardTitle>
        <CardDescription>
          Tell us about your products, services, and business terms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productCatalog">Product Catalog (PDF)</Label>
          <Input
            id="productCatalog"
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && onFileUpload('productCatalog', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            Upload your complete product or service catalog
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceList">Price List (PDF or Excel)</Label>
          <Input
            id="priceList"
            type="file"
            accept=".pdf,.xlsx,.xls"
            onChange={(e) => e.target.files?.[0] && onFileUpload('priceList', e.target.files[0])}
          />
          <p className="text-xs text-muted-foreground">
            Upload your current price list with all products/services
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minimumOrderValue">Minimum Order Value (SAR)</Label>
            <Input
              id="minimumOrderValue"
              type="number"
              min="0"
              step="0.01"
              value={formData.minimumOrderValue || ''}
              onChange={(e) => onChange('minimumOrderValue', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliverySLA">Delivery SLA (Days) *</Label>
            <Input
              id="deliverySLA"
              type="number"
              min="1"
              value={formData.deliverySLADays || ''}
              onChange={(e) => onChange('deliverySLADays', parseInt(e.target.value) || 0)}
              placeholder="e.g., 7"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms *</Label>
          <Select value={formData.paymentTerms} onValueChange={(v) => onChange('paymentTerms', v)}>
            <SelectTrigger id="paymentTerms">
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash on Delivery</SelectItem>
              <SelectItem value="30_days">Net 30 Days</SelectItem>
              <SelectItem value="60_days">Net 60 Days</SelectItem>
              <SelectItem value="90_days">Net 90 Days</SelectItem>
              <SelectItem value="consignment">Consignment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
