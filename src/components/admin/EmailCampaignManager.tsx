import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Plus, 
  Send, 
  Eye, 
  Edit,
  Copy,
  BarChart,
  Users,
  Calendar,
  TrendingUp
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEmailCampaigns } from "@/hooks/useEmailCampaigns";
import { useToast } from "@/hooks/use-toast";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

export const EmailCampaignManager = () => {
  const { 
    campaigns, 
    templates, 
    campaignStats, 
    createCampaign,
    createTemplate,
    sendCampaign,
    isLoading 
  } = useEmailCampaigns();
  const { toast } = useToast();
  const { t, isRTL } = useOptionalLanguage();

  const [activeTab, setActiveTab] = useState("campaigns");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    template_id: "",
    target_audience: "all_users",
    scheduled_for: ""
  });

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    html_content: "",
    category: "announcement"
  });

  const handleCreateCampaign = async () => {
    try {
      await createCampaign(newCampaign);
      setNewCampaign({
        name: "",
        subject: "",
        template_id: "",
        target_audience: "all_users",
        scheduled_for: ""
      });
      setIsCreateDialogOpen(false);
      toast({
        title: t("common.success"),
        description: t("admin.email.campaignCreatedSuccess")
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.email.campaignCreateFailed"),
        variant: "destructive"
      });
    }
  };

  const handleCreateTemplate = async () => {
    try {
      await createTemplate(newTemplate);
      setNewTemplate({
        name: "",
        subject: "",
        html_content: "",
        category: "announcement"
      });
      setIsTemplateDialogOpen(false);
      toast({
        title: t("common.success"),
        description: t("admin.email.templateCreatedSuccess")
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.email.templateCreateFailed"),
        variant: "destructive"
      });
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      await sendCampaign(campaignId);
      toast({
        title: t("common.success"),
        description: t("admin.email.campaignSentSuccess")
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.email.campaignSendFailed"),
        variant: "destructive"
      });
    }
  };

  // Calculate performance data from real campaigns
  const performanceData = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return [];
    
    return campaigns.reduce((months: any[], campaign) => {
      const month = new Date(campaign.created_at).toLocaleDateString('en', { month: 'short' });
      const existingMonth = months.find(m => m.month === month);
      
      // Use available properties from campaign object
      const sentCount = campaign.stats?.sent || 0;
      const openedCount = campaign.stats?.opened || 0;
      const clickedCount = campaign.stats?.clicked || 0;
      
      if (existingMonth) {
        existingMonth.sent += sentCount;
        existingMonth.opened += openedCount;
        existingMonth.clicked += clickedCount;
      } else {
        months.push({
          month,
          sent: sentCount,
          opened: openedCount,
          clicked: clickedCount
        });
      }
      return months;
    }, []);
  }, [campaigns]);

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
          <TabsList>
            <TabsTrigger value="campaigns">{t('admin.email.campaigns')}</TabsTrigger>
            <TabsTrigger value="templates">{t('admin.email.templates')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('admin.email.analytics')}</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            {activeTab === "campaigns" && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.email.newCampaign')}
                  </Button>
                </DialogTrigger>
                 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                   <DialogHeader>
                     <DialogTitle>{t('admin.email.createCampaign')}</DialogTitle>
                   </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">{t('admin.email.campaignName')}</label>
                      <Input
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        placeholder={t('admin.email.campaignNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t('admin.email.emailSubject')}</label>
                      <Input
                        value={newCampaign.subject}
                        onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                        placeholder={t('admin.email.subjectPlaceholder')}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">{t('admin.email.template')}</label>
                        <Select value={newCampaign.template_id} onValueChange={(value) => setNewCampaign({...newCampaign, template_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.email.selectTemplate')} />
                          </SelectTrigger>
                          <SelectContent>
                            {templates?.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">{t('admin.email.targetAudience')}</label>
                        <Select value={newCampaign.target_audience} onValueChange={(value) => setNewCampaign({...newCampaign, target_audience: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_users">{t('admin.email.allUsers')}</SelectItem>
                            <SelectItem value="clients">{t('admin.email.clientsOnly')}</SelectItem>
                            <SelectItem value="vendors">{t('admin.email.vendorsOnly')}</SelectItem>
                            <SelectItem value="active_users">{t('admin.email.activeUsers')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t('admin.email.scheduleOptional')}</label>
                      <Input
                        type="datetime-local"
                        value={newCampaign.scheduled_for}
                        onChange={(e) => setNewCampaign({...newCampaign, scheduled_for: e.target.value})}
                      />
                    </div>
                    <div className={cn("flex justify-end space-x-2", isRTL && "flex-row-reverse space-x-reverse")}>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        {t('common.cancel')}
                      </Button>
                      <Button onClick={handleCreateCampaign}>
                        {t('admin.email.createCampaign')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            {activeTab === "templates" && (
              <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Email Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Template Name</label>
                        <Input
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                          placeholder="Newsletter Template"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="newsletter">Newsletter</SelectItem>
                            <SelectItem value="promotion">Promotion</SelectItem>
                            <SelectItem value="welcome">Welcome</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Default Subject</label>
                      <Input
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                        placeholder="{{company_name}} Weekly Update"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">HTML Content</label>
                      <Textarea
                        value={newTemplate.html_content}
                        onChange={(e) => setNewTemplate({...newTemplate, html_content: e.target.value})}
                        placeholder="<!DOCTYPE html><html><body>...</body></html>"
                        rows={15}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTemplate}>
                        Create Template
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaignStats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sent This Month</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{campaignStats?.sentThisMonth || 0}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-info">{campaignStats?.openRate || 0}%</div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{campaignStats?.clickRate || 0}%</div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : campaigns?.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No campaigns yet</p>
                  <p className="text-muted-foreground">Create your first email campaign to get started</p>
                </CardContent>
              </Card>
            ) : (
              campaigns?.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <Badge variant={campaign.status === 'sent' ? 'default' : campaign.status === 'scheduled' ? 'secondary' : 'outline'}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">Subject: {campaign.subject}</p>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>Target: {campaign.target_audience}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
                          </div>
                          {campaign.sent_at && (
                            <div className="flex items-center space-x-1">
                              <Send className="h-4 w-4" />
                              <span>Sent: {new Date(campaign.sent_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        {campaign.status === 'draft' && (
                          <Button size="sm" onClick={() => handleSendCampaign(campaign.id)}>
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4">
            {templates?.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">Subject: {template.subject}</p>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {new Date(template.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No templates yet</p>
                  <p className="text-muted-foreground">Create your first email template to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Performance Trends</CardTitle>
              <CardDescription>Email metrics over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sent" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Sent"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Opened"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicked" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    name="Clicked"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Monthly Newsletter - May', 'Product Launch Announcement', 'Spring Sale Campaign'].map((campaign, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <span className="font-medium">{campaign}</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-success">{85 - index * 5}% open rate</div>
                        <div className="text-sm text-muted-foreground">{15 - index * 2}% click rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>All Users</span>
                    <div className="text-right">
                      <div className="font-semibold">2,341 recipients</div>
                      <div className="text-sm text-muted-foreground">78% avg open rate</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Clients</span>
                    <div className="text-right">
                      <div className="font-semibold">1,205 recipients</div>
                      <div className="text-sm text-muted-foreground">82% avg open rate</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Vendors</span>
                    <div className="text-right">
                      <div className="font-semibold">892 recipients</div>
                      <div className="text-sm text-muted-foreground">74% avg open rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};