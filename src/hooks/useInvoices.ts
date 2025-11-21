import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  tax_rate: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  sort_order?: number;
  notes?: string;
}

export interface Invoice {
  id?: string;
  invoice_number?: string;
  order_id?: string;
  purchase_order_id?: string;
  client_id: string;
  vendor_id: string;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount?: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  payment_terms?: string;
  notes?: string;
  internal_notes?: string;
}

export const useInvoices = (userRole?: 'client' | 'vendor') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading, error, isError } = useQuery({
    queryKey: ['invoices', userRole],
    queryFn: async () => {
      try {
        let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching invoices:', error);
          throw error;
        }
        return data as Invoice[];
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
        // Return empty array instead of throwing to prevent crashes
        return [] as Invoice[];
      }
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
  });

  const createInvoice = useMutation({
    mutationFn: async (invoice: Partial<Invoice>) => {
      // Generate invoice number
      const { data: invoiceNumber } = await supabase.rpc('generate_invoice_number');
      
      const invoiceData = {
        client_id: invoice.client_id!,
        vendor_id: invoice.vendor_id!,
        invoice_number: invoiceNumber as string,
        issue_date: invoice.issue_date || new Date().toISOString().split('T')[0],
        due_date: invoice.due_date!,
        total_amount: invoice.total_amount || 0,
        subtotal: invoice.subtotal || 0,
        tax_rate: invoice.tax_rate || 0,
        tax_amount: invoice.tax_amount || 0,
        currency: invoice.currency || 'SAR',
        status: invoice.status || 'draft',
        payment_terms: invoice.payment_terms,
        notes: invoice.notes,
        internal_notes: invoice.internal_notes,
        order_id: invoice.order_id,
        purchase_order_id: invoice.purchase_order_id,
      };
      
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: 'Invoice Created',
        description: 'Invoice has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateInvoice = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Invoice> }) => {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: 'Invoice Updated',
        description: 'Invoice has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    invoices,
    isLoading,
    error,
    isError,
    createInvoice,
    updateInvoice,
  };
};

export const useInvoiceItems = (invoiceId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['invoice-items', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return [];
      
      const { data, error } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('sort_order');
      
      if (error) throw error;
      return data as InvoiceItem[];
    },
    enabled: !!invoiceId,
  });

  const addItem = useMutation({
    mutationFn: async (item: Omit<InvoiceItem, 'id'> & { invoice_id: string }) => {
      const { data, error } = await supabase
        .from('invoice_items')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-items'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InvoiceItem> }) => {
      const { data, error } = await supabase
        .from('invoice_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-items'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoice_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-items'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
  };
};

export const useInvoicePayments = (invoiceId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['invoice-payments', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return [];
      
      const { data, error } = await supabase
        .from('invoice_payments')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!invoiceId,
  });

  const recordPayment = useMutation({
    mutationFn: async (payment: {
      invoice_id: string;
      amount: number;
      payment_date: string;
      payment_method: string;
      transaction_reference?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('invoice_payments')
        .insert(payment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: 'Payment Recorded',
        description: 'Payment has been recorded successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    payments,
    isLoading,
    recordPayment,
  };
};
