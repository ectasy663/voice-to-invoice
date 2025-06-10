export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  client: string;
  items: InvoiceItem[];
  total: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface RecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  transcribedText: string;
  error: string | null;
}
