// Simulated API functions with realistic delays and data

export interface DummyResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional failures for realism
const shouldSimulateFailure = (failureRate: number = 0.1) => Math.random() < failureRate;

export const dummyApi = {
  // Subscription management
  async upgradeSubscription(plan: string): Promise<DummyResponse<{ checkoutUrl: string }>> {
    await delay(1500);
    
    if (shouldSimulateFailure(0.05)) {
      return { success: false, error: 'Payment processing failed. Please try again.' };
    }
    
    return {
      success: true,
      data: {
        checkoutUrl: `https://checkout.stripe.com/dummy-session-${Date.now()}-${plan.toLowerCase()}`
      }
    };
  },

  async cancelSubscription(): Promise<DummyResponse<{ message: string }>> {
    await delay(2000);
    
    if (shouldSimulateFailure(0.03)) {
      return { success: false, error: 'Failed to cancel subscription. Please contact support.' };
    }
    
    return {
      success: true,
      data: { message: 'Subscription cancelled successfully. Access will continue until period end.' }
    };
  },

  async updatePaymentMethod(cardData: any): Promise<DummyResponse<{ message: string }>> {
    await delay(1800);
    
    if (shouldSimulateFailure(0.08)) {
      return { success: false, error: 'Failed to update payment method. Please check card details.' };
    }
    
    return {
      success: true,
      data: { message: 'Payment method updated successfully.' }
    };
  },

  // Orders management
  async updateOrderStatus(orderId: string, status: string): Promise<DummyResponse<{ order: any }>> {
    await delay(1200);
    
    if (shouldSimulateFailure(0.05)) {
      return { success: false, error: 'Failed to update order status. Please try again.' };
    }
    
    return {
      success: true,
      data: {
        order: {
          id: orderId,
          status,
          updatedAt: new Date().toISOString()
        }
      }
    };
  },

  async generateInvoice(orderId: string): Promise<DummyResponse<{ invoiceUrl: string }>> {
    await delay(2500);
    
    if (shouldSimulateFailure(0.03)) {
      return { success: false, error: 'Failed to generate invoice. Please try again later.' };
    }
    
    return {
      success: true,
      data: {
        invoiceUrl: `https://supplify.com/invoices/INV-${orderId}-${Date.now()}.pdf`
      }
    };
  },

  // Analytics
  async exportAnalytics(dateRange: { start: string; end: string }): Promise<DummyResponse<{ downloadUrl: string }>> {
    await delay(3000);
    
    if (shouldSimulateFailure(0.05)) {
      return { success: false, error: 'Export failed. Please try again.' };
    }
    
    return {
      success: true,
      data: {
        downloadUrl: `https://supplify.com/exports/analytics-${dateRange.start}-to-${dateRange.end}.xlsx`
      }
    };
  },

  // Support
  async submitSupportTicket(ticket: any): Promise<DummyResponse<{ ticketId: string }>> {
    await delay(1500);
    
    if (shouldSimulateFailure(0.02)) {
      return { success: false, error: 'Failed to submit ticket. Please try again.' };
    }
    
    return {
      success: true,
      data: {
        ticketId: `TICK-${Date.now()}`
      }
    };
  },

  async sendChatMessage(message: string, recipient: string): Promise<DummyResponse<{ messageId: string; response?: string }>> {
    await delay(800);
    
    if (shouldSimulateFailure(0.01)) {
      return { success: false, error: 'Failed to send message. Please check your connection.' };
    }
    
    // Simulate different response types
    const responses = [
      "Thank you for your message. I'll review the details and get back to you shortly.",
      "I understand your requirements. Let me prepare a detailed proposal for you.",
      "That's an interesting project! I have experience with similar events. Can you share more details?",
      "I'm available for this project. My team can handle all the technical requirements you mentioned.",
      "Let me check my availability for those dates and send you a comprehensive quote."
    ];
    
    const shouldSendResponse = Math.random() > 0.3; // 70% chance of immediate response
    
    return {
      success: true,
      data: {
        messageId: `MSG-${Date.now()}`,
        response: shouldSendResponse ? responses[Math.floor(Math.random() * responses.length)] : undefined
      }
    };
  },

  // Video call simulation
  async initiateVideoCall(supplierName: string): Promise<DummyResponse<{ callId: string; roomUrl: string }>> {
    await delay(2000);
    
    if (shouldSimulateFailure(0.1)) {
      return { success: false, error: 'Failed to connect call. Supplier may be unavailable.' };
    }
    
    return {
      success: true,
      data: {
        callId: `CALL-${Date.now()}`,
        roomUrl: `https://meet.supplify.com/room/${Date.now()}`
      }
    };
  }
};