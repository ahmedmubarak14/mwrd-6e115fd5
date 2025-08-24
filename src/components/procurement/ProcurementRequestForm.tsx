
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CategorySelector } from '@/components/enhanced/CategorySelector';
import { useRequests } from '@/hooks/useRequests';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BOQItem {
  item_code: string;
  description: string;
  unit: string;
  quantity: number;
  specifications: string;
  notes?: string;
}

interface CategoryData {
  id: string;
  name_en: string;
  name_ar: string;
}

export const ProcurementRequestForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<CategoryData[]>([]);
  const [boqItems, setBOQItems] = useState<BOQItem[]>([
    { item_code: '', description: '', unit: '', quantity: 1, specifications: '', notes: '' }
  ]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
    location: '',
    deadline: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    payment_terms: '',
    delivery_requirements: '',
    quality_standards: ''
  });

  const { createRequest, loading } = useRequests();
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Categories', description: 'Select procurement categories' },
    { number: 2, title: 'BOQ Items', description: 'Bill of quantities and specifications' },
    { number: 3, title: 'Details', description: 'Project details and requirements' }
  ];

  const addBOQItem = () => {
    setBOQItems([...boqItems, { item_code: '', description: '', unit: '', quantity: 1, specifications: '', notes: '' }]);
  };

  const removeBOQItem = (index: number) => {
    setBOQItems(boqItems.filter((_, i) => i !== index));
  };

  const updateBOQItem = (index: number, field: keyof BOQItem, value: string | number) => {
    const updatedItems = boqItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setBOQItems(updatedItems);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const newItems: BOQItem[] = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          item_code: values[0] || '',
          description: values[1] || '',
          unit: values[2] || '',
          quantity: parseInt(values[3]) || 1,
          specifications: values[4] || '',
          notes: values[5] || ''
        };
      }).filter(item => item.description.trim() !== '');

      setBOQItems(newItems);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      // Create the main request with the first category as primary
      const primaryCategory = selectedCategories[0];
      if (!primaryCategory) {
        toast({
          title: "Error",
          description: "Please select at least one category",
          variant: "destructive"
        });
        return;
      }

      const requestData = {
        title: formData.title,
        description: formData.description,
        category: primaryCategory.name_en, // Required field for legacy compatibility
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
        location: formData.location,
        deadline: formData.deadline,
        urgency: formData.urgency,
        requirements: {
          payment_terms: formData.payment_terms,
          delivery_requirements: formData.delivery_requirements,
          quality_standards: formData.quality_standards,
          boq_items: boqItems,
          categories: selectedCategories
        }
      };

      await createRequest(requestData);
      
      toast({
        title: "Success",
        description: "Procurement request submitted successfully"
      });
      
      navigate('/procurement-requests');
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to submit request",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Steps Header */}
      <Card>
        <CardHeader>
          <CardTitle>Create Procurement Request</CardTitle>
          <CardDescription>Follow the steps to submit your procurement request</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.number}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="mx-4 h-5 w-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Categories</CardTitle>
            <CardDescription>Choose the procurement categories for your request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CategorySelector
              selectedCategories={selectedCategories.map(cat => cat.id)}
              onChange={(categoryIds) => {
                // This would need to be enhanced to get full category objects
                // For now, we'll handle this in a simplified way
                setSelectedCategories(categoryIds.map(id => ({ id, name_en: 'Category', name_ar: 'فئة' })));
              }}
              multiple={true}
            />
            
            {selectedCategories.length > 0 && (
              <div>
                <Label>Selected Categories:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map(category => (
                    <Badge key={category.id} variant="secondary">
                      {category.name_en}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Bill of Quantities (BOQ)</CardTitle>
            <CardDescription>Add items and specifications for your procurement request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={addBOQItem} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              
              <div>
                <Label htmlFor="csv-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </span>
                  </Button>
                </Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                />
              </div>
            </div>

            <div className="space-y-4">
              {boqItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Item Code</Label>
                        <Input
                          value={item.item_code}
                          onChange={(e) => updateBOQItem(index, 'item_code', e.target.value)}
                          placeholder="SKU/Code"
                        />
                      </div>
                      
                      <div>
                        <Label>Description *</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateBOQItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Unit</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) => updateBOQItem(index, 'unit', e.target.value)}
                          placeholder="pcs, kg, m, etc."
                        />
                      </div>
                      
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateBOQItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div>
                        <Label>Specifications</Label>
                        <Textarea
                          value={item.specifications}
                          onChange={(e) => updateBOQItem(index, 'specifications', e.target.value)}
                          placeholder="Technical specifications, standards, requirements..."
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex-1 mr-2">
                          <Label>Notes</Label>
                          <Input
                            value={item.notes}
                            onChange={(e) => updateBOQItem(index, 'notes', e.target.value)}
                            placeholder="Additional notes..."
                          />
                        </div>
                        
                        {boqItems.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeBOQItem(index)}
                            className="mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Provide additional information for your procurement request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief title for your request"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select 
                  value={formData.urgency} 
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                    setFormData(prev => ({ ...prev, urgency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of your procurement needs"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget_min">Min Budget</Label>
                <Input
                  id="budget_min"
                  type="number"
                  value={formData.budget_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                  placeholder="Minimum budget"
                />
              </div>
              
              <div>
                <Label htmlFor="budget_max">Max Budget</Label>
                <Input
                  id="budget_max"
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                  placeholder="Maximum budget"
                />
              </div>
              
              <div>
                <Label htmlFor="deadline">Target Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Delivery Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, region, or specific address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment_terms">Payment Terms</Label>
                <Input
                  id="payment_terms"
                  value={formData.payment_terms}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value }))}
                  placeholder="Net 30, 50% upfront, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="delivery_requirements">Delivery Requirements</Label>
                <Input
                  id="delivery_requirements"
                  value={formData.delivery_requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_requirements: e.target.value }))}
                  placeholder="Packaging, handling, timing requirements"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="quality_standards">Quality Standards</Label>
              <Textarea
                id="quality_standards"
                value={formData.quality_standards}
                onChange={(e) => setFormData(prev => ({ ...prev, quality_standards: e.target.value }))}
                placeholder="Required certifications, standards, compliance requirements..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < 3 ? (
          <Button onClick={nextStep}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        )}
      </div>
    </div>
  );
};
