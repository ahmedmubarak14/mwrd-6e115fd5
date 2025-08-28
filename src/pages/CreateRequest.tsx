import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Clock, 
  DollarSign,
  Calendar,
  AlertCircle,
  Package,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";

const CATEGORIES = [
  "Construction & Building",
  "Electrical Services", 
  "Plumbing & HVAC",
  "Interior Design",
  "Landscaping",
  "Cleaning Services",
  "Security Services",
  "IT & Technology",
  "Catering & Food Services",
  "Transportation & Logistics",
  "Professional Services",
  "Marketing & Advertising"
];

const URGENCY_LEVELS = [
  { value: "low", label: "Low Priority", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "Medium Priority", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High Priority", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" }
];

export default function CreateRequest() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    urgency: "medium",
    budget_min: "",
    budget_max: "",
    currency: "SAR",
    deadline: "",
    requirements: {}
  });

  const showSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) {
      showError("Please log in to create a request");
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      showError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location || null,
        urgency: formData.urgency,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        currency: formData.currency,
        deadline: formData.deadline || null,
        requirements: formData.requirements,
        client_id: userProfile.user_id,
        admin_approval_status: "pending"
      };

      const { error } = await supabase
        .from("requests")
        .insert([requestData]);

      if (error) throw error;

      showSuccess("Request created successfully!");
      navigate("/requests");
    } catch (error) {
      console.error("Error creating request:", error);
      showError("Failed to create request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/requests")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Request</h1>
            <p className="text-muted-foreground">Submit a new procurement request to find vendors</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Request Details
              </CardTitle>
              <CardDescription>
                Provide detailed information about your procurement needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Request Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Office renovation project"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Provide a detailed description of your requirements..."
                    rows={4}
                    required
                  />
                </div>

                {/* Category and Location */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      <MapPin className="inline mr-2 h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Riyadh, Saudi Arabia"
                    />
                  </div>
                </div>

                {/* Urgency and Deadline */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">
                      <Clock className="inline mr-2 h-4 w-4" />
                      Urgency Level
                    </Label>
                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        {URGENCY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={level.color}>
                                {level.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">
                      <Calendar className="inline mr-2 h-4 w-4" />
                      Deadline (Optional)
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                </div>

                {/* Budget Range */}
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Budget Range (Optional)
                  </Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="budget_min" className="text-sm">
                        Minimum Budget
                      </Label>
                      <Input
                        id="budget_min"
                        type="number"
                        value={formData.budget_min}
                        onChange={(e) => handleInputChange("budget_min", e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget_max" className="text-sm">
                        Maximum Budget
                      </Label>
                      <Input
                        id="budget_max"
                        type="number"
                        value={formData.budget_max}
                        onChange={(e) => handleInputChange("budget_max", e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm">
                        Currency
                      </Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">SAR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse gap-3 pt-6 border-t sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/requests")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating Request...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Create Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Process Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Process Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Submit Request</p>
                    <p className="text-xs text-muted-foreground">Provide detailed requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1.5">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Admin Review</p>
                    <p className="text-xs text-muted-foreground">Request gets reviewed and approved</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1.5">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Vendor Matching</p>
                    <p className="text-xs text-muted-foreground">Qualified vendors submit offers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1.5">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Select Winner</p>
                    <p className="text-xs text-muted-foreground">Review and choose the best offer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Tips for Better Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Be specific about your requirements
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Include technical specifications if needed
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Set realistic budget ranges
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Provide clear deadlines
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}