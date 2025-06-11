import type { InvoiceData, InvoiceItem } from '../types';

// Check if we should use the backend API
const USE_BACKEND_API = import.meta.env.VITE_USE_BACKEND_API === 'true';

// Base API URL - will be used when backend is available
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Extended invoice types for the service
export interface Invoice extends InvoiceData {
  id: string;
  userId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  taxRate?: number;
  taxAmount?: number;
  subtotal: number;
  discountAmount?: number;
  discountPercentage?: number;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  logoUrl?: string;
}

export interface InvoiceFilters {
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  clientName?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'client' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  totalPages: number;
}

// Invoice-related API calls
export const invoiceService = {
  /**
   * Create a new invoice
   */
  createInvoice: async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; invoice?: Invoice; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, invoice: data.invoice };
      } catch (error) {
        console.error('Create invoice failed:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to create invoice. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock invoice with generated ID
      const mockInvoice: Invoice = {
        ...invoiceData,
        id: `INV-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { success: true, invoice: mockInvoice };
    }
  },

  /**
   * Get invoice by ID
   */
  getInvoice: async (invoiceId: string): Promise<{ success: boolean; invoice?: Invoice; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, invoice: data.invoice };
      } catch (error) {
        console.error('Get invoice failed:', error);
        return { 
          success: false, 
          error: 'Failed to fetch invoice. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock invoice data
      const mockInvoice: Invoice = {
        id: invoiceId,
        userId: 'user-123',
        invoiceNumber: `INV-${invoiceId.slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        client: 'Acme Corporation',
        clientEmail: 'billing@acme.com',
        clientAddress: '123 Business St, City, State 12345',
        items: [
          {
            description: 'Consulting Services',
            quantity: 10,
            rate: 150,
            amount: 1500
          },
          {
            description: 'Software Development',
            quantity: 20,
            rate: 100,
            amount: 2000
          }
        ],
        subtotal: 3500,
        taxRate: 8.5,
        taxAmount: 297.50,
        total: 3797.50,
        status: 'sent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyName: 'Your Business Name',
        companyEmail: 'billing@yourbusiness.com',
        companyAddress: '456 Your St, Your City, State 67890'
      };

      return { success: true, invoice: mockInvoice };
    }
  },

  /**
   * Get all invoices with optional filtering
   */
  getInvoices: async (filters?: InvoiceFilters): Promise<{ success: boolean; data?: InvoiceListResponse; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const queryParams = new URLSearchParams();
        
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                value.forEach(v => queryParams.append(key, v));
              } else {
                queryParams.append(key, value.toString());
              }
            }
          });
        }

        const response = await fetch(`${API_BASE_URL}/api/invoices?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        console.error('Get invoices failed:', error);
        return { 
          success: false, 
          error: 'Failed to fetch invoices. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Generate mock invoices
      const mockInvoices: Invoice[] = Array.from({ length: 12 }, (_, index) => ({
        id: `invoice-${index + 1}`,
        userId: 'user-123',
        invoiceNumber: `INV-${String(index + 1).padStart(4, '0')}`,
        date: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        dueDate: new Date(Date.now() + ((30 - index * 7) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        client: `Client ${index + 1}`,
        clientEmail: `client${index + 1}@example.com`,
        items: [
          {
            description: `Service ${index + 1}`,
            quantity: Math.floor(Math.random() * 10) + 1,
            rate: Math.floor(Math.random() * 200) + 50,
            amount: Math.floor(Math.random() * 2000) + 500
          }
        ],
        subtotal: Math.floor(Math.random() * 2000) + 500,
        taxRate: 8.5,
        taxAmount: Math.floor((Math.random() * 2000 + 500) * 0.085),
        total: Math.floor(Math.random() * 2500) + 750,
        status: ['draft', 'sent', 'paid', 'overdue'][Math.floor(Math.random() * 4)] as any,
        createdAt: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        companyName: 'Your Business Name',
        companyEmail: 'billing@yourbusiness.com'
      }));

      // Apply filters (basic implementation)
      let filteredInvoices = mockInvoices;
      
      if (filters?.status && filters.status.length > 0) {
        filteredInvoices = filteredInvoices.filter(inv => filters.status!.includes(inv.status));
      }

      if (filters?.clientName) {
        filteredInvoices = filteredInvoices.filter(inv => 
          inv.client.toLowerCase().includes(filters.clientName!.toLowerCase())
        );
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + limit);

      const response: InvoiceListResponse = {
        invoices: paginatedInvoices,
        total: filteredInvoices.length,
        page,
        totalPages: Math.ceil(filteredInvoices.length / limit)
      };

      return { success: true, data: response };
    }
  },

  /**
   * Update an existing invoice
   */
  updateInvoice: async (invoiceId: string, updates: Partial<Invoice>): Promise<{ success: boolean; invoice?: Invoice; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, invoice: data.invoice };
      } catch (error) {
        console.error('Update invoice failed:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to update invoice. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // First get the existing invoice (mock)
      const existingResult = await invoiceService.getInvoice(invoiceId);
      if (!existingResult.success || !existingResult.invoice) {
        return { success: false, error: 'Invoice not found' };
      }

      // Apply updates
      const updatedInvoice: Invoice = {
        ...existingResult.invoice,
        ...updates,
        id: invoiceId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };

      return { success: true, invoice: updatedInvoice };
    }
  },

  /**
   * Delete an invoice
   */
  deleteInvoice: async (invoiceId: string): Promise<{ success: boolean; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
      } catch (error) {
        console.error('Delete invoice failed:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to delete invoice. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock successful deletion
      return { success: true };
    }
  },

  /**
   * Send invoice to client via email
   */
  sendInvoice: async (invoiceId: string, recipientEmail?: string): Promise<{ success: boolean; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ recipientEmail }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
      } catch (error) {
        console.error('Send invoice failed:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to send invoice. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock successful send
      return { success: true };
    }
  },

  /**
   * Mark invoice as paid
   */
  markAsPaid: async (invoiceId: string, paidDate?: string): Promise<{ success: boolean; invoice?: Invoice; error?: string }> => {
    const paymentDate = paidDate || new Date().toISOString().split('T')[0];
    
    return invoiceService.updateInvoice(invoiceId, {
      status: 'paid',
      paidDate: paymentDate
    });
  },

  /**
   * Generate PDF for invoice
   */
  generatePDF: async (invoiceId: string): Promise<{ success: boolean; pdfUrl?: string; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/pdf`, {
          method: 'GET',
          headers: {
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the PDF blob
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        return { success: true, pdfUrl };
      } catch (error) {
        console.error('Generate PDF failed:', error);
        return { 
          success: false, 
          error: 'Failed to generate PDF. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, create a simple text file
      const invoice = await invoiceService.getInvoice(invoiceId);
      if (!invoice.success || !invoice.invoice) {
        return { success: false, error: 'Invoice not found' };
      }

      const invoiceText = `
INVOICE
-------
Invoice Number: ${invoice.invoice.invoiceNumber}
Date: ${invoice.invoice.date}
Due Date: ${invoice.invoice.dueDate}

Bill To:
${invoice.invoice.client}
${invoice.invoice.clientEmail || ''}

Items:
${invoice.invoice.items.map(item => 
  `${item.description} - Qty: ${item.quantity} @ $${item.rate} = $${item.amount}`
).join('\n')}

Subtotal: $${invoice.invoice.subtotal}
Tax: $${invoice.invoice.taxAmount || 0}
Total: $${invoice.invoice.total}

Status: ${invoice.invoice.status.toUpperCase()}
      `;

      const blob = new Blob([invoiceText], { type: 'text/plain' });
      const pdfUrl = URL.createObjectURL(blob);
      
      return { success: true, pdfUrl };
    }
  },

  /**
   * Get invoice statistics
   */
  getInvoiceStats: async (): Promise<{ success: boolean; stats?: any; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/invoices/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, stats: data.stats };
      } catch (error) {
        console.error('Get invoice stats failed:', error);
        return { 
          success: false, 
          error: 'Failed to fetch invoice statistics. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock statistics
      const mockStats = {
        totalInvoices: 42,
        totalRevenue: 15750.00,
        averageInvoiceValue: 375.00,
        paidInvoices: 35,
        unpaidInvoices: 7,
        overdueInvoices: 3,
        draftInvoices: 2,
        invoicesThisMonth: 8,
        revenueThisMonth: 3200.00,
        revenueLastMonth: 2800.00,
        growthPercentage: 14.3,
        topClients: [
          { name: 'Acme Corp', revenue: 3200.00, invoiceCount: 6 },
          { name: 'TechStart Inc', revenue: 2800.00, invoiceCount: 4 },
          { name: 'Global Solutions', revenue: 2100.00, invoiceCount: 3 }
        ]
      };

      return { success: true, stats: mockStats };
    }
  }
};

// Export individual functions for convenience
export const {
  createInvoice,
  getInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
  markAsPaid,
  generatePDF,
  getInvoiceStats
} = invoiceService;

export default invoiceService;
