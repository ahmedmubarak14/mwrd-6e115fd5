import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, Package, TrendingUp, DollarSign, Clock, CheckCircle, Star } from "lucide-react";

export const SupplierDashboard = () => {
  const { t } = useLanguage();

  const stats = [
    { title: "Active Offers", value: "12", icon: Package, color: "text-primary" },
    { title: "Monthly Revenue", value: "$24,500", icon: DollarSign, color: "text-lime" },
    { title: "Success Rate", value: "85%", icon: TrendingUp, color: "text-primary" },
    { title: "Client Rating", value: "4.8", icon: Star, color: "text-lime" }
  ];

  const availableRequests = [
    { 
      id: 1, 
      title: "إعداد الصوت والصورة للمؤتمر", 
      englishTitle: "Conference AVL Setup",
      category: "الصوت والصورة والإضاءة", 
      englishCategory: "AVL",
      budget: "20,000 - 30,000 ر.س", 
      englishBudget: "5,000 - 8,000 SAR",
      deadline: "20 مارس 2024",
      englishDeadline: "Mar 20, 2024",
      location: "الرياض",
      englishLocation: "Riyadh",
      posted: "منذ ساعتين",
      englishPosted: "2 hours ago"
    },
    { 
      id: 2, 
      title: "ضيافة الفعاليات الشركاتية", 
      englishTitle: "Corporate Event Catering",
      category: "الضيافة", 
      englishCategory: "Hospitality",
      budget: "11,000 - 19,000 ر.س", 
      englishBudget: "3,000 - 5,000 SAR",
      deadline: "25 مارس 2024",
      englishDeadline: "Mar 25, 2024",
      location: "جدة",
      englishLocation: "Jeddah",
      posted: "منذ 5 ساعات",
      englishPosted: "5 hours ago"
    },
    { 
      id: 3, 
      title: "تصميم كشك المعرض التجاري", 
      englishTitle: "Trade Show Booth Design",
      category: "أكشاك العرض", 
      englishCategory: "Booth Stands",
      budget: "37,000 - 56,000 ر.س", 
      englishBudget: "10,000 - 15,000 SAR",
      deadline: "1 أبريل 2024",
      englishDeadline: "Apr 1, 2024",
      location: "الدمام",
      englishLocation: "Dammam",
      posted: "منذ يوم واحد",
      englishPosted: "1 day ago"
    }
  ];

  const myOffers = [
    { 
      id: 1, 
      title: "Wedding Photography Package", 
      client: "Happy Events Co.", 
      amount: "$2,500", 
      status: "pending",
      submitted: "1 day ago"
    },
    { 
      id: 2, 
      title: "Corporate Meeting Setup", 
      client: "Tech Solutions Ltd.", 
      amount: "$1,800", 
      status: "accepted",
      submitted: "3 days ago"
    },
    { 
      id: 3, 
      title: "Exhibition Booth Furniture", 
      client: "Global Exhibitions", 
      amount: "$4,200", 
      status: "in_progress",
      submitted: "5 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-lime/20 text-lime-foreground';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Supplier Dashboard</h1>
        <p className="text-xl opacity-90 mb-6">Manage your offers and grow your business</p>
        <Button className="bg-lime hover:bg-lime/90 text-black font-semibold">
          <Eye className="h-5 w-5 mr-2" />
          Browse New Requests
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available Requests</CardTitle>
              <CardDescription>New opportunities matching your services</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{request.title}</h4>
                      <p className="text-sm text-muted-foreground">{request.category} • {request.location}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{request.posted}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Budget: </span>
                      <span className="font-medium text-lime">{request.budget}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Deadline: </span>
                      <span className="font-medium">{request.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Submit Offer
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Offers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Offers</CardTitle>
              <CardDescription>Track your submitted proposals</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myOffers.map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{offer.title}</h4>
                      <p className="text-sm text-muted-foreground">{offer.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lime">{offer.amount}</p>
                      <p className="text-xs text-muted-foreground">{offer.submitted}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                      {getStatusText(offer.status)}
                    </span>
                    <div className="flex gap-2">
                      {offer.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          Edit Offer
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Offer accepted</p>
                  <p className="text-xs text-muted-foreground">Corporate Meeting Setup</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New offer submitted</p>
                  <p className="text-xs text-muted-foreground">Wedding Photography</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-lime" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Rating improved</p>
                  <p className="text-xs text-muted-foreground">Now 4.8/5 stars</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Offers Submitted</span>
                <span className="font-medium">18</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: '75%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Success Rate</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-lime rounded-full h-2" style={{ width: '85%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Browse Requests
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Package className="h-4 w-4 mr-2" />
              My Offers
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Client Reviews
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};