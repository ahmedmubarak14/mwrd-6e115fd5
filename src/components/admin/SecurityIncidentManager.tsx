import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Search,
  Filter,
  Mail,
  Phone
} from "lucide-react";
import { useSecurityIncidents } from "@/hooks/useSecurityIncidents";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const SecurityIncidentManager = () => {
  const { incidents, createIncident, updateIncident, isLoading } = useSecurityIncidents();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    category: "security_breach",
    affectedSystems: "",
    reportedBy: ""
  });

  const severityColors = {
    critical: "destructive",
    high: "destructive", 
    medium: "secondary",
    low: "default"
  };

  const statusColors = {
    open: "destructive",
    investigating: "secondary", 
    resolved: "default",
    closed: "outline"
  };

  const filteredIncidents = incidents?.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === "all" || incident.severity === filterSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  }) || [];

  const handleCreateIncident = async () => {
    try {
      await createIncident(newIncident);
      setNewIncident({
        title: "",
        description: "",
        severity: "medium",
        category: "security_breach",
        affectedSystems: "",
        reportedBy: ""
      });
      setIsCreateDialogOpen(false);
      toast({
        title: t("common.success"),
        description: t("admin.security.incidentCreatedSuccess")
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.security.incidentCreateFailed"),
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (incidentId: string, status: string) => {
    try {
      await updateIncident(incidentId, { status: status as "open" | "investigating" | "resolved" | "closed" });
      toast({
        title: t("common.success"),
        description: t("admin.security.incidentStatusUpdated")
      });
    } catch (error) {
      toast({
        title: t("common.error"), 
        description: t("admin.security.incidentStatusUpdateFailed"),
        variant: "destructive"
      });
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}${t("admin.security.daysAgo")}`;
    if (diffHours > 0) return `${diffHours}${t("admin.security.hoursAgo")}`;
    return t("admin.security.lessThanHourAgo");
  };

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Actions */}
      <div className={cn("flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4", isRTL && "lg:flex-row-reverse")}>
        <div className={cn("flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4", isRTL && "sm:flex-row-reverse")}>
          <div className="relative">
            <Search className={cn("absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
            <Input
              placeholder={t("admin.security.searchIncidents")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn("w-full sm:w-64", isRTL ? "pr-10" : "pl-10")}
            />
          </div>
          <div className={cn("flex gap-2 sm:gap-4", isRTL && "flex-row-reverse")}>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("admin.security.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.security.allStatus")}</SelectItem>
                <SelectItem value="open">{t("admin.security.open")}</SelectItem>
                <SelectItem value="investigating">{t("admin.security.investigating")}</SelectItem>
                <SelectItem value="resolved">{t("admin.security.resolved")}</SelectItem>
                <SelectItem value="closed">{t("admin.security.closed")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("admin.security.severity")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.security.allSeverity")}</SelectItem>
                <SelectItem value="critical">{t("admin.security.critical")}</SelectItem>
                <SelectItem value="high">{t("admin.security.high")}</SelectItem>
                <SelectItem value="medium">{t("admin.security.medium")}</SelectItem>
                <SelectItem value="low">{t("admin.security.low")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="sm:inline">{t("admin.security.createIncident")}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle>{t("admin.security.createSecurityIncident")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t("admin.security.title")}</label>
                <Input
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                  placeholder={t("admin.security.incidentTitlePlaceholder")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("admin.security.description")}</label>
                <Textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  placeholder={t("admin.security.detailedIncidentDescription")}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t("admin.security.severity")}</label>
                  <Select value={newIncident.severity} onValueChange={(value) => setNewIncident({...newIncident, severity: value as "low" | "medium" | "high" | "critical"})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">{t("admin.security.critical")}</SelectItem>
                      <SelectItem value="high">{t("admin.security.high")}</SelectItem>
                      <SelectItem value="medium">{t("admin.security.medium")}</SelectItem>
                      <SelectItem value="low">{t("admin.security.low")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">{t("admin.security.category")}</label>
                  <Select value={newIncident.category} onValueChange={(value) => setNewIncident({...newIncident, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security_breach">{t("admin.security.securityBreach")}</SelectItem>
                      <SelectItem value="data_leak">{t("admin.security.dataLeak")}</SelectItem>
                      <SelectItem value="unauthorized_access">{t("admin.security.unauthorizedAccess")}</SelectItem>
                      <SelectItem value="malware">{t("admin.security.malware")}</SelectItem>
                      <SelectItem value="phishing">{t("admin.security.phishing")}</SelectItem>
                      <SelectItem value="ddos">{t("admin.security.ddosAttack")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">{t("admin.security.affectedSystems")}</label>
                <Input
                  value={newIncident.affectedSystems}
                  onChange={(e) => setNewIncident({...newIncident, affectedSystems: e.target.value})}
                  placeholder={t("admin.security.systemsOrComponentsAffected")}
                />
              </div>
              <div className={cn("flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2", isRTL && "sm:flex-row-reverse sm:space-x-reverse")}>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="w-full sm:w-auto">
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleCreateIncident} className="w-full sm:w-auto">
                  {t("admin.security.createIncident")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Incidents List */}
      <div className="grid gap-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
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
        ) : filteredIncidents.length === 0 ? (
          <Card>
            <CardContent className={cn("p-12 text-center", isRTL ? "text-right" : "text-left")}>
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">{t("admin.security.noSecurityIncidentsFound")}</p>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterSeverity !== "all" 
                  ? t("admin.security.tryAdjustingFilters")
                  : t("admin.security.greatNoActiveIncidents")
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredIncidents.map((incident) => (
            <Card key={incident.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedIncident(incident)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <Badge variant={severityColors[incident.severity as keyof typeof severityColors] as "default" | "destructive" | "secondary" | "outline"}>
                        {incident.severity}
                      </Badge>
                      <Badge variant={statusColors[incident.status as keyof typeof statusColors] as "default" | "destructive" | "secondary" | "outline"}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{incident.description}</p>
                    <div className={cn("flex items-center space-x-6 text-sm text-muted-foreground", isRTL && "space-x-reverse")}>
                      <div className={cn("flex items-center space-x-1", isRTL && "space-x-reverse")}>
                        <Clock className="h-4 w-4" />
                        <span>{getTimeAgo(incident.created_at)}</span>
                      </div>
                      <div>{t("admin.security.category")}: {incident.category}</div>
                      {incident.affected_systems && (
                        <div>{t("admin.security.systems")}: {incident.affected_systems}</div>
                      )}
                    </div>
                  </div>
                  <div className={cn("flex space-x-2", isRTL && "space-x-reverse")}>
                    {incident.status !== 'closed' && (
                      <>
                        {incident.status === 'open' && (
                          <Button size="sm" variant="outline" 
                                  onClick={(e) => {e.stopPropagation(); handleUpdateStatus(incident.id, 'investigating')}}>
                            {t("admin.security.startInvestigation")}
                          </Button>
                        )}
                        {incident.status === 'investigating' && (
                          <Button size="sm" variant="outline"
                                  onClick={(e) => {e.stopPropagation(); handleUpdateStatus(incident.id, 'resolved')}}>
                            {t("admin.security.markResolved")}
                          </Button>
                        )}
                        {incident.status === 'resolved' && (
                          <Button size="sm" variant="outline"
                                  onClick={(e) => {e.stopPropagation(); handleUpdateStatus(incident.id, 'closed')}}>
                            {t("admin.security.closeIncident")}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Incident Details Dialog */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedIncident && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <span>{selectedIncident.title}</span>
                  <Badge variant={severityColors[selectedIncident.severity]}>
                    {selectedIncident.severity}
                  </Badge>
                  <Badge variant={statusColors[selectedIncident.status]}>
                    {selectedIncident.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">{t("admin.security.details")}</TabsTrigger>
                  <TabsTrigger value="timeline">{t("admin.security.timeline")}</TabsTrigger>
                  <TabsTrigger value="response">{t("admin.security.responseActions")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t("admin.security.created")}</label>
                      <p>{new Date(selectedIncident.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t("admin.security.category")}</label>
                      <p>{selectedIncident.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t("admin.security.affectedSystems")}</label>
                      <p>{selectedIncident.affected_systems || t("admin.security.notSpecified")}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t("admin.security.reportedBy")}</label>
                      <p>{selectedIncident.reported_by || t("admin.security.system")}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("admin.security.description")}</label>
                    <p className="mt-1">{selectedIncident.description}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <div className="border-l-2 border-muted pl-4 pb-4">
                      <div className={cn("flex items-center space-x-2 mb-1", isRTL && "space-x-reverse")}>
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">{t("admin.security.incidentCreated")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedIncident.created_at).toLocaleString()}
                      </p>
                    </div>
                    {selectedIncident.updated_at !== selectedIncident.created_at && (
                      <div className="border-l-2 border-muted pl-4">
                        <div className={cn("flex items-center space-x-2 mb-1", isRTL && "space-x-reverse")}>
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm font-medium">{t("admin.security.lastUpdated")}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedIncident.updated_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="response">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className={cn("justify-start", isRTL && "justify-end")}>
                        <Mail className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t("admin.security.sendAlertEmail")}
                      </Button>
                      <Button variant="outline" className={cn("justify-start", isRTL && "justify-end")}>
                        <Phone className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t("admin.security.escalateToOnCall")}
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className={cn("font-medium mb-2", isRTL ? "text-right" : "text-left")}>{t("admin.security.quickActions")}</h4>
                      <div className={cn("flex space-x-2", isRTL && "space-x-reverse")}>
                        <Button size="sm" variant="outline"
                                onClick={() => handleUpdateStatus(selectedIncident.id, 'investigating')}>
                          {t("admin.security.investigate")}
                        </Button>
                        <Button size="sm" variant="outline"
                                onClick={() => handleUpdateStatus(selectedIncident.id, 'resolved')}>
                          {t("admin.security.resolve")}
                        </Button>
                        <Button size="sm" variant="outline"
                                onClick={() => handleUpdateStatus(selectedIncident.id, 'closed')}>
                          {t("admin.security.close")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};