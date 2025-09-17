import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRealTimeRequests } from '@/hooks/useRealTimeRequests';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'Construction Materials',
  'IT Equipment',
  'Office Supplies',
  'Industrial Equipment',
  'Medical Equipment',
  'Transportation',
  'Catering Services',
  'Maintenance Services',
  'Consulting Services',
  'Security Services'
];

const CITIES = [
  'Riyadh','Jeddah','Mecca','Medina','Dammam','Khobar','Dhahran','Taif','Buraidah','Tabuk','Khamis Mushait','Hail','Jubail','Abha'
];

export const SimpleRequestForm = () => {
  const { createRequest } = useRealTimeRequests();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget_min: '',
    budget_max: '',
    location: '',
    national_address: '',
    deadline: undefined as Date | undefined,
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const descriptionToSend = formData.description + (formData.national_address?.trim() ? `\n\nAddress: ${formData.national_address.trim()}` : '');
      await createRequest({
        title: formData.title,
        description: descriptionToSend,
        category: formData.category,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
        location: formData.location || undefined,
        deadline: formData.deadline?.toISOString().split('T')[0] || undefined,
        urgency: formData.urgency
      });
      
      toast({
        title: "Success",
        description: "Request created successfully!"
      });
      
      navigate('/client/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: "Failed to create request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter request title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed description of what you need"
              className="min-h-32"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget_min">Minimum Budget</Label>
              <Input
                id="budget_min"
                type="number"
                value={formData.budget_min}
                onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                placeholder="0"
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="budget_max">Maximum Budget</Label>
              <Input
                id="budget_max"
                type="number"
                value={formData.budget_max}
                onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">City</Label>
            <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="z-50">
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="national_address">National Address or Short Address</Label>
            <Textarea
              id="national_address"
              value={formData.national_address}
              onChange={(e) => setFormData({ ...formData, national_address: e.target.value })}
              placeholder="Enter national address or short delivery address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => setFormData({...formData, deadline: date})}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={formData.urgency} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setFormData({...formData, urgency: value})}>
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

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/client/requests')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};