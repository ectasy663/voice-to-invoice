// OTP Service for handling OTP generation, sending, and verification
import { sendOTPEmail as sendEmail, extractNameFromEmail } from './emailService';

export interface OTPResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Mock OTP storage (in real app, this would be stored securely on backend)
const otpStorage = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via real email service
export const sendOTPEmail = async (email: string, purpose: 'login' | 'signup'): Promise<OTPResponse> => {
  try {
    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Store OTP (in real app, this would be stored in database)
    otpStorage.set(email, {
      otp,
      expiresAt,
      attempts: 0
    });

    // Get recipient name from email
    const recipientName = extractNameFromEmail(email);

    // Send actual email using the email service
    const emailResult = await sendEmail(email, otp, purpose, recipientName);

    if (emailResult.success) {
      console.log(`✅ OTP email sent successfully to ${email}`);
      console.log(`📧 Message ID: ${emailResult.messageId}`);
      
      return {
        success: true,
        message: `OTP sent successfully to ${email}. Please check your email inbox.`
      };
    } else {
      // If email sending fails, remove the OTP from storage
      otpStorage.delete(email);
      
      return {
        success: false,
        message: 'Failed to send OTP email',
        error: emailResult.error || 'Email service unavailable'
      };
    }
  } catch (error: any) {
    // Clean up on error
    otpStorage.delete(email);
    
    console.error('❌ OTP sending failed:', error);
    return {
      success: false,
      message: 'Failed to send OTP',
      error: error.message || 'Email service temporarily unavailable'
    };
  }
};

// Verify OTP
export const verifyOTP = async (email: string, enteredOTP: string): Promise<OTPVerificationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const storedData = otpStorage.get(email);

  if (!storedData) {
    return {
      success: false,
      message: 'No OTP found for this email',
      error: 'Please request a new OTP'
    };
  }

  // Check if OTP has expired
  if (Date.now() > storedData.expiresAt) {
    otpStorage.delete(email);
    return {
      success: false,
      message: 'OTP has expired',
      error: 'Please request a new OTP'
    };
  }

  // Check attempts limit
  if (storedData.attempts >= 3) {
    otpStorage.delete(email);
    return {
      success: false,
      message: 'Too many failed attempts',
      error: 'Please request a new OTP'
    };
  }

  // Verify OTP
  if (storedData.otp === enteredOTP) {
    otpStorage.delete(email); // Clear OTP after successful verification
    return {
      success: true,
      message: 'OTP verified successfully'
    };
  } else {
    // Increment failed attempts
    storedData.attempts++;
    otpStorage.set(email, storedData);

    return {
      success: false,
      message: 'Invalid OTP',
      error: `${3 - storedData.attempts} attempts remaining`
    };
  }
};

// Resend OTP
export const resendOTP = async (email: string, purpose: 'login' | 'signup'): Promise<OTPResponse> => {
  // Clear existing OTP
  otpStorage.delete(email);
  
  // Send new OTP
  return await sendOTPEmail(email, purpose);
};

// Request notification permission (for demo purposes)
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Get remaining time for OTP expiry
export const getOTPExpiryTime = (email: string): number => {
  const storedData = otpStorage.get(email);
  if (!storedData) return 0;
  
  const remaining = storedData.expiresAt - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
};

// Clean expired OTPs (utility function)
export const cleanExpiredOTPs = (): void => {
  const now = Date.now();
  for (const [email, data] of otpStorage.entries()) {
    if (now > data.expiresAt) {
      otpStorage.delete(email);
    }
  }
};

// Format email for display (hide part of email for security)
export const formatEmailForDisplay = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return email; // Don't hide if too short
  }
  
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-1);
  const hidden = '*'.repeat(Math.max(1, localPart.length - 3));
  
  return `${visibleStart}${hidden}${visibleEnd}@${domain}`;
};
