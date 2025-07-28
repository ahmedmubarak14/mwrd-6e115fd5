import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Calendar, Clock, TrendingUp, Users, FileText, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const Home = () => {
  const { t } = useLanguage();

  const quickActions = [
    {
      title: t('dashboard.createRequest'),
      description: "Post a new service request and get offers from suppliers",
      icon: Plus,
      href: "/requests/create",
      color: "text-lime"
    },
    {
      title: t('dashboard.viewRequests'),
      description: "View and manage your existing service requests",
      icon: FileText,
      href: "/requests",
      color: "text-primary"
    },
    {
      title: t('dashboard.browseSuppliers'),
      description: "Discover vetted suppliers for your events",
      icon: Users,
      href: "/suppliers",
      color: "text-primary"
    }
  ];

  const upcomingEvents = [
    { id: 1, title: "Tech Conference 2024", date: "Mar 15, 2024", status: "In Progress", progress: 75 },
    { id: 2, title: "Product Launch Event", date: "Mar 22, 2024", status: "Planning", progress: 30 },
    { id: 3, title: "Annual Company Meeting", date: "Apr 5, 2024", status: "Planning", progress: 15 }
  ];

  const recentActivity = [
    { id: 1, action: "New offer received", item: "AVL Equipment for Conference", time: "2 hours ago", type: "offer" },
    { id: 2, action: "Request approved", item: "Catering Services", time: "5 hours ago", type: "approval" },
    { id: 3, action: "Supplier selected", item: "Booth Design & Setup", time: "1 day ago", type: "selection" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar userRole="client" />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-2">Welcome back to Supplify!</h1>
              <p className="text-xl opacity-90 mb-6">Manage your events and connect with the best suppliers</p>
              <div className="flex gap-4">
                <Link to="/requests/create">
                  <Button className="bg-lime hover:bg-lime/90 text-black font-semibold">
                    <Plus className="h-5 w-5 mr-2" />
                    {t('dashboard.createRequest')}
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="secondary">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with your next event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {quickActions.map((action, index) => (
                        <Link key={index} to={action.href}>
                          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="pb-3">
                              <action.icon className={`h-8 w-8 ${action.color} mb-2`} />
                              <CardTitle className="text-lg">{action.title}</CardTitle>
                              <CardDescription className="text-sm">{action.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Upcoming Events
                      </CardTitle>
                      <CardDescription>Track your event progress</CardDescription>
                    </div>
                    <Link to="/events">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Calendar className="h-4 w-4" />
                              {event.date}
                            </p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Progress</span>
                                <span className="text-xs text-muted-foreground">{event.progress}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary rounded-full h-2 transition-all" 
                                  style={{ width: `${event.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              event.status === 'In Progress' ? 'bg-lime/20 text-lime-foreground' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Stats Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Active Requests</p>
                          <p className="text-2xl font-bold">3</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-lime/10 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-lime" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Pending Offers</p>
                          <p className="text-2xl font-bold">8</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Connected Suppliers</p>
                          <p className="text-2xl font-bold">12</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className={`p-1 rounded-full ${
                            activity.type === 'offer' ? 'bg-lime/10' :
                            activity.type === 'approval' ? 'bg-green-100' :
                            'bg-primary/10'
                          }`}>
                            <CheckCircle className={`h-4 w-4 ${
                              activity.type === 'offer' ? 'text-lime' :
                              activity.type === 'approval' ? 'text-green-600' :
                              'text-primary'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground truncate">{activity.item}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};