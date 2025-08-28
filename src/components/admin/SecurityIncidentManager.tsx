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

export const SecurityIncidentManager = () => {
  const { incidents, createIncident, updateIncident, isLoading } = useSecurityIncidents();
  const { toast } = useToast();
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
        title: "Success",
        description: "Security incident created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create security incident",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (incidentId: string, status: string) => {
    try {
      await updateIncident(incidentId, { status: status as "open" | "investigating" | "resolved" | "closed" });
      toast({
        title: "Success",
        description: `Incident status updated to ${status}`
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to update incident status",
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
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return "< 1h ago";
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="sm:inline">Create Incident</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle>Create Security Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                  placeholder="Incident title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  placeholder="Detailed incident description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Select value={newIncident.severity} onValueChange={(value) => setNewIncident({...newIncident, severity: value as "low" | "medium" | "high" | "critical"})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newIncident.category} onValueChange={(value) => setNewIncident({...newIncident, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security_breach">Security Breach</SelectItem>
                      <SelectItem value="data_leak">Data Leak</SelectItem>
                      <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                      <SelectItem value="malware">Malware</SelectItem>
                      <SelectItem value="phishing">Phishing</SelectItem>
                      <SelectItem value="ddos">DDoS Attack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Affected Systems</label>
                <Input
                  value={newIncident.affectedSystems}
                  onChange={(e) => setNewIncident({...newIncident, affectedSystems: e.target.value})}
                  placeholder="Systems or components affected"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleCreateIncident} className="w-full sm:w-auto">
                  Create Incident
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
            <CardContent className="p-12 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No security incidents found</p>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterSeverity !== "all" 
                  ? "Try adjusting your filters"
                  : "Great! No active security incidents to report"
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
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeAgo(incident.created_at)}</span>
                      </div>
                      <div>Category: {incident.category}</div>
                      {incident.affected_systems && (
                        <div>Systems: {incident.affected_systems}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {incident.status !== 'closed' && (
                      <>
                        {incident.status === 'open' && (
                          <Button size="sm" variant="outline" 
                                  onClick={(e) => {e.stopPropagation(); handleUpdateStatus(incident.id, 'investigating')}}>
                            Start Investigation
                          </Button>
                        )}
                        {incident.status === 'investigating' && (
                          <Button size="sm" variant="outline"
                                  onClick={(e) => {e.stopPropagation(); handleUpdateStatus(incident.id, 'resolved')}}>
                            Mark Resolved
                          </Button>
                        )}
                        {incident.status === 'resolved' && (
                          <Button size="sm" variant="outline"
                                  onClick={(e) => {e.stopPropagation(); handleUpdateStatus(incident.id, 'closed')}}>
                            Close Incident
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
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="response">Response Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created</label>
                      <p>{new Date(selectedIncident.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <p>{selectedIncident.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Affected Systems</label>
                      <p>{selectedIncident.affected_systems || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reported By</label>
                      <p>{selectedIncident.reported_by || "System"}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="mt-1">{selectedIncident.description}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <div className="border-l-2 border-muted pl-4 pb-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">Incident Created</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedIncident.created_at).toLocaleString()}
                      </p>
                    </div>
                    {selectedIncident.updated_at !== selectedIncident.created_at && (
                      <div className="border-l-2 border-muted pl-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm font-medium">Last Updated</span>
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
                      <Button variant="outline" className="justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Alert Email
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        Escalate to On-Call
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Quick Actions</h4>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline"
                                onClick={() => handleUpdateStatus(selectedIncident.id, 'investigating')}>
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline"
                                onClick={() => handleUpdateStatus(selectedIncident.id, 'resolved')}>
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline"
                                onClick={() => handleUpdateStatus(selectedIncident.id, 'closed')}>
                          Close
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