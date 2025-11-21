import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

const MOYASAR_API_URL = 'https://api.moyasar.com/v1';

export interface MoyasarPaymentRequest {
  amount: number; // Amount in halalas (1 SAR = 100 halalas)
  currency: string;
  description: string;
  callback_url?: string;
  source: {
    type: 'creditcard' | 'applepay' | 'stcpay';
    name?: string;
    number?: string;
    cvc?: string;
    month?: string;
    year?: string;
    token?: string; // For saved cards
  };
  metadata?: Record<string, any>;
}

export interface MoyasarPaymentResponse {
  id: string;
  status: 'initiated' | 'paid' | 'failed' | 'authorized' | 'captured' | 'refunded';
  amount: number;
  fee: number;
  currency: string;
  refunded: number;
  refunded_at: string | null;
  captured: number | null;
  captured_at: string | null;
  voided_at: string | null;
  description: string;
  amount_format: string;
  fee_format: string;
  refunded_format: string;
  captured_format: string;
  invoice_id: string | null;
  ip: string;
  callback_url: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  source: {
    type: string;
    company: string;
    name: string;
    number: string;
    gateway_id: string;
    reference_number: string | null;
    token: string;
    message: string | null;
    transaction_url: string;
  };
}

export interface MoyasarRefundRequest {
  amount?: number; // Optional, defaults to full refund
}

class MoyasarService {
  private apiKey: string | null = null;
  private isTestMode: boolean = true;

  async initialize() {
    // Load API key from payment settings
    const { data: settings } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('provider', 'moyasar')
      .eq('is_enabled', true)
      .single();

    if (settings) {
      this.isTestMode = settings.is_test_mode;
      this.apiKey = this.isTestMode
        ? settings.api_key_test
        : settings.api_key_live;
    }
  }

  private getHeaders() {
    if (!this.apiKey) {
      throw new Error('Moyasar API key not configured');
    }

    return {
      'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Create a payment
   */
  async createPayment(request: MoyasarPaymentRequest): Promise<MoyasarPaymentResponse> {
    try {
      await this.initialize();

      const response = await axios.post<MoyasarPaymentResponse>(
        `${MOYASAR_API_URL}/payments`,
        request,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Moyasar payment creation failed:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Payment creation failed');
    }
  }

  /**
   * Get payment status
   */
  async getPayment(paymentId: string): Promise<MoyasarPaymentResponse> {
    try {
      await this.initialize();

      const response = await axios.get<MoyasarPaymentResponse>(
        `${MOYASAR_API_URL}/payments/${paymentId}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch payment:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, amount?: number): Promise<MoyasarPaymentResponse> {
    try {
      await this.initialize();

      const request: MoyasarRefundRequest = amount ? { amount } : {};

      const response = await axios.post<MoyasarPaymentResponse>(
        `${MOYASAR_API_URL}/payments/${paymentId}/refund`,
        request,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Moyasar refund failed:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Refund failed');
    }
  }

  /**
   * Capture an authorized payment
   */
  async capturePayment(paymentId: string, amount?: number): Promise<MoyasarPaymentResponse> {
    try {
      await this.initialize();

      const response = await axios.post<MoyasarPaymentResponse>(
        `${MOYASAR_API_URL}/payments/${paymentId}/capture`,
        amount ? { amount } : {},
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Moyasar capture failed:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Capture failed');
    }
  }

  /**
   * Void an authorized payment
   */
  async voidPayment(paymentId: string): Promise<MoyasarPaymentResponse> {
    try {
      await this.initialize();

      const response = await axios.post<MoyasarPaymentResponse>(
        `${MOYASAR_API_URL}/payments/${paymentId}/void`,
        {},
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('Moyasar void failed:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Void failed');
    }
  }

  /**
   * Load Moyasar checkout script dynamically
   */
  loadCheckoutScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('moyasar-checkout-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'moyasar-checkout-script';
      script.src = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Moyasar checkout script'));
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Moyasar hosted checkout
   */
  async initializeCheckout(config: {
    amount: number; // In SAR (will be converted to halalas)
    currency?: string;
    description: string;
    publishable_api_key: string;
    callback_url: string;
    methods: ('creditcard' | 'applepay' | 'stcpay')[];
    metadata?: Record<string, any>;
    on_completed?: (payment: MoyasarPaymentResponse) => void;
    on_failed?: (error: any) => void;
  }) {
    await this.loadCheckoutScript();

    // Moyasar expects amount in halalas (1 SAR = 100 halalas)
    const amountInHalalas = Math.round(config.amount * 100);

    // Initialize Moyasar checkout
    if (typeof (window as any).Moyasar !== 'undefined') {
      (window as any).Moyasar.init({
        element: '.moyasar-form',
        amount: amountInHalalas,
        currency: config.currency || 'SAR',
        description: config.description,
        publishable_api_key: config.publishable_api_key,
        callback_url: config.callback_url,
        methods: config.methods,
        metadata: config.metadata || {},
        on_completed: config.on_completed,
        on_failed: config.on_failed,
        language: 'ar', // Support Arabic
        apple_pay: {
          country: 'SA',
          label: config.description,
          validate_merchant_url: `${window.location.origin}/api/apple-pay/validate`,
        },
      });
    } else {
      throw new Error('Moyasar checkout script not loaded');
    }
  }

  /**
   * Format amount for display (from halalas to SAR)
   */
  formatAmount(amountInHalalas: number): string {
    return (amountInHalalas / 100).toFixed(2);
  }

  /**
   * Convert SAR to halalas
   */
  toHalalas(amountInSAR: number): number {
    return Math.round(amountInSAR * 100);
  }

  /**
   * Convert halalas to SAR
   */
  toSAR(amountInHalalas: number): number {
    return amountInHalalas / 100;
  }
}

// Singleton instance
export const moyasarService = new MoyasarService();
