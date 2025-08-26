
import { format } from 'date-fns';

export interface ExportData {
  [key: string]: any;
}

export interface ExportOptions {
  filename: string;
  format: 'csv' | 'json';
  includeHeaders?: boolean;
}

export class DataExporter {
  static exportToCSV(data: ExportData[], filename: string): void {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas, quotes, or newlines
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  static exportToJSON(data: ExportData[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  static exportAnalytics(data: any, period: string): void {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const filename = `analytics_${period}_${timestamp}`;
    
    const exportData = [{
      period,
      exportDate: new Date().toISOString(),
      totalUsers: data.totalUsers || 0,
      totalRequests: data.totalRequests || 0,
      totalOffers: data.totalOffers || 0,
      totalTransactions: data.totalTransactions || 0,
      monthlyRevenue: data.monthlyRevenue || 0,
      activeSubscriptions: data.activeSubscriptions || 0
    }];

    this.exportToCSV(exportData, filename);
  }

  static exportUserData(users: any[]): void {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const filename = `users_export_${timestamp}`;
    
    const exportData = users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name || '',
      role: user.role,
      status: user.status,
      verificationStatus: user.verification_status,
      companyName: user.company_name || '',
      phone: user.phone || '',
      createdAt: user.created_at,
      lastActive: user.updated_at
    }));

    this.exportToCSV(exportData, filename);
  }

  static exportTicketsData(tickets: any[]): void {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const filename = `support_tickets_${timestamp}`;
    
    const exportData = tickets.map(ticket => ({
      id: ticket.id,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      userEmail: ticket.user_profiles?.email || '',
      userName: ticket.user_profiles?.full_name || '',
      assignedAdmin: ticket.assigned_admin?.full_name || '',
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at
    }));

    this.exportToCSV(exportData, filename);
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
