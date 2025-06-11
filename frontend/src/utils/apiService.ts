// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface SendOTPRequest {
  email: string;
  purpose: 'login' | 'signup' | 'reset';
}

export interface VerifyOTPRequest {
  email: string;
  otp_code: string;
  purpose: 'login' | 'signup' | 'reset';
}

export interface APIResponse {
  success: boolean;
  message: string;
  email: string;
  otp_code?: string; // For demo mode
}

export const sendOTP = async (email: string, purpose: 'login' | 'signup' | 'reset'): Promise<APIResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, purpose }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: APIResponse = await response.json();
    console.log('OTP sent:', data);
    return data;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw new Error('Failed to send OTP. Please try again.');
  }
};

export const verifyOTP = async (email: string, otp_code: string, purpose: 'login' | 'signup' | 'reset'): Promise<APIResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp_code, purpose }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const data: APIResponse = await response.json();
    console.log('OTP verified:', data);
    return data;
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    throw error;
  }
};

// Health check function
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
