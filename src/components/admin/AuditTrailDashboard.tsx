import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Database, 
  Download, 
  Calendar as CalendarIcon, 
  Filter,
  Search,
  User,
  Activity,
  Eye,
  Edit,
  Trash,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { useAuditTrail } from "@/hooks/useAuditTrail";
import { useToast } from "@/hooks/use-toast";

import { DateRange } from "react-day-picker";

export const AuditTrailDashboard = () => {
  const { auditLogs, exportAuditLog, isLoading } = useAuditTrail();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntity, setFilterEntity] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const actionIcons = {
    INSERT: <User className="h-4 w-4 text-green-500" />,
    UPDATE: <Edit className="h-4 w-4 text-blue-500" />,
    DELETE: <Trash className="h-4 w-4 text-red-500" />,
    SELECT: <Eye className="h-4 w-4 text-gray-500" />,
    LOGIN: <Shield className="h-4 w-4 text-purple-500" />,
    LOGOUT: <Shield className="h-4 w-4 text-orange-500" />,
  };

  const filteredLogs = auditLogs?.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_id?.includes(searchTerm);
    
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesEntity = filterEntity === "all" || log.entity_type === filterEntity;
    
    const logDate = new Date(log.created_at);
    const matchesDateRange = 
      (!dateRange?.from || logDate >= dateRange.from) &&
      (!dateRange?.to || logDate <= dateRange.to);
    
    return matchesSearch && matchesAction && matchesEntity && matchesDateRange;
  }) || [];

  const handleExportLogs = async () => {
    try {
      await exportAuditLog({
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
        action: filterAction !== "all" ? filterAction : undefined,
        entityType: filterEntity !== "all" ? filterEntity : undefined
      });
      toast({
        title: "Success",
        description: "Audit logs exported successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export audit logs",
        variant: "destructive"
      });
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'INSERT': return 'default';
      case 'UPDATE': return 'secondary';
      case 'DELETE': return 'destructive';
      case 'LOGIN': case 'LOGOUT': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Audit Trail Controls
          </CardTitle>
          <CardDescription>
            Filter and export audit log data for compliance and investigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="INSERT">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="LOGOUT">Logout</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="user_profiles">Users</SelectItem>
                <SelectItem value="requests">Requests</SelectItem>
                <SelectItem value="offers">Offers</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="financial_transactions">Transactions</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {auditLogs?.length || 0} audit entries
            </div>
            <Button onClick={handleExportLogs} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>Complete audit trail of system activities</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 border rounded">
                    <div className="w-8 h-8 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-6 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No audit logs found</p>
              <p className="text-muted-foreground">
                {searchTerm || filterAction !== "all" || filterEntity !== "all" || dateRange.from
                  ? "Try adjusting your filters"
                  : "No audit activities to display"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-center space-x-4 p-4 border rounded hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    {actionIcons[log.action as keyof typeof actionIcons] || 
                     <Activity className="h-4 w-4 text-gray-500" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-muted-foreground">on</span>
                      <span className="font-medium">{log.entity_type}</span>
                      {log.entity_id && (
                        <>
                          <span className="text-muted-foreground">ID:</span>
                          <code className="text-xs bg-muted px-1 rounded">
                            {log.entity_id.substring(0, 8)}...
                          </code>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{log.user_id ? `User: ${log.user_id.substring(0, 8)}...` : 'System'}</span>
                      </div>
                      <div>{format(new Date(log.created_at), "MMM dd, yyyy 'at' h:mm a")}</div>
                    </div>
                  </div>
                  
                  <Badge variant={getActionBadgeVariant(log.action)}>
                    {log.action}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};