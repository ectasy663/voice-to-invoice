import type { User } from '../types';
import { sendOTP, verifyOTP } from './apiService';

// Check if we should use the backend API
const USE_BACKEND_API = import.meta.env.VITE_USE_BACKEND_API === 'true';

// Legacy mock users for fallback with passwords
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe'
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith'
  },  {
    id: '3',
    email: 'demo@thedemologounge.com',
    name: 'Demo User'
  },
  {
    id: '4',
    email: 'test@thedemologounge.com',
    name: 'Test User'
  }
];

// Mock user passwords (in real app, these would be hashed and stored securely)
const mockPasswords: Record<string, string> = {
  'john.doe@example.com': 'password123',
  'jane.smith@example.com': 'password123',
  'demo@thedemologounge.com': 'password123',
  'test@thedemologounge.com': 'test123'
};

// Temporary storage for pending authentications (before OTP verification)
const pendingAuth = new Map<string, { user: User; password: string; type: 'login' | 'signup' }>();

// Step 1: Initiate login process (send OTP)
export const initiateLogin = async (email: string, password: string): Promise<{ success: boolean; requiresOTP?: boolean; error?: string }> => {
  if (USE_BACKEND_API) {
    try {
      // Use backend API
      const result = await sendOTP(email, 'login');
      
      if (result.success) {
        // Store basic auth info temporarily (not sensitive data)
        const tempUser: User = {
          id: 'temp',
          email: email,
          name: email.split('@')[0]
        };
        
        pendingAuth.set(email, {
          user: tempUser,
          password: password,
          type: 'login'
        });
        
        return { success: true, requiresOTP: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Backend login failed:', error);
      return { success: false, error: 'Failed to connect to server. Please try again.' };
    }
  } else {
    // Fallback to mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }    const existingUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (!existingUser) {
      return { success: false, error: 'No account found with this email address' };
    }

    // Check password for mock users
    const expectedPassword = mockPasswords[existingUser.email];
    if (!expectedPassword || password !== expectedPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    pendingAuth.set(email, {
      user: existingUser,
      password,
      type: 'login'
    });

    return { success: true, requiresOTP: true };
  }
};

// Step 2: Complete login with OTP verification
export const completeLogin = async (email: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  if (USE_BACKEND_API) {
    try {
      // Verify OTP with backend
      const otpResult = await verifyOTP(email, otp, 'login');
      
      if (otpResult.success) {
        // Get pending authentication
        const pending = pendingAuth.get(email);
        
        if (!pending || pending.type !== 'login') {
          return { success: false, error: 'Authentication session expired. Please try again.' };
        }

        // Clear pending authentication
        pendingAuth.delete(email);

        return { success: true, user: pending.user };
      } else {
        return { success: false, error: otpResult.message };
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      return { success: false, error: 'OTP verification failed. Please try again.' };
    }
  } else {
    // Fallback to mock implementation
    const pending = pendingAuth.get(email);
    
    if (!pending || pending.type !== 'login') {
      return { success: false, error: 'Authentication session expired. Please try again.' };
    }

    // Mock OTP verification (accept 123456 or generated OTP)
    if (otp === '123456' || otp.length === 6) {
      pendingAuth.delete(email);
      return { success: true, user: pending.user };
    } else {
      return { success: false, error: 'Invalid OTP' };
    }
  }
};

// Legacy auth function (for backward compatibility)
export const mockAuth = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  // This now redirects to the new OTP flow
  const initResult = await initiateLogin(email, password);
  if (!initResult.success) {
    return { success: false, error: initResult.error };
  }
  
  // Return indication that OTP is required
  return { success: false, error: 'OTP_REQUIRED' };
};

// Step 1: Initiate registration process (send OTP)
export const initiateRegistration = async (email: string, password: string, fullName: string): Promise<{ success: boolean; requiresOTP?: boolean; error?: string }> => {
  if (USE_BACKEND_API) {
    try {
      // Use backend API
      const result = await sendOTP(email, 'signup');
      
      if (result.success) {
        // Create new user object
        const newUser: User = {
          id: 'temp',
          email: email,
          name: fullName || email.split('@')[0]
        };

        // Store pending registration
        pendingAuth.set(email, {
          user: newUser,
          password,
          type: 'signup'
        });

        return { success: true, requiresOTP: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Backend registration failed:', error);
      return { success: false, error: 'Failed to connect to server. Please try again.' };
    }
  } else {
    // Fallback to mock implementation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simple validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    
    // Mock email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create new user object
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: email,
      name: fullName || email.split('@')[0]
    };

    // Store pending registration
    pendingAuth.set(email, {
      user: newUser,
      password,
      type: 'signup'
    });

    return { success: true, requiresOTP: true };
  }
};

// Step 2: Complete registration with OTP verification
export const completeRegistration = async (email: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  if (USE_BACKEND_API) {
    try {
      // Verify OTP with backend
      const otpResult = await verifyOTP(email, otp, 'signup');
      
      if (otpResult.success) {
        // Get pending registration
        const pending = pendingAuth.get(email);
        
        if (!pending || pending.type !== 'signup') {
          return { success: false, error: 'Registration session expired. Please try again.' };
        }

        // Clear pending registration
        pendingAuth.delete(email);

        // Add user to mock database for future logins
        mockUsers.push(pending.user);

        return { success: true, user: pending.user };
      } else {
        return { success: false, error: otpResult.message };
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      return { success: false, error: 'OTP verification failed. Please try again.' };
    }
  } else {
    // Fallback to mock implementation
    const pending = pendingAuth.get(email);
    
    if (!pending || pending.type !== 'signup') {
      return { success: false, error: 'Registration session expired. Please try again.' };
    }

    // Mock OTP verification (accept 123456 or any 6-digit code)
    if (otp === '123456' || otp.length === 6) {
      // Clear pending registration
      pendingAuth.delete(email);

      // Add user to mock database
      mockUsers.push(pending.user);

      return { success: true, user: pending.user };
    } else {
      return { success: false, error: 'Invalid OTP' };
    }
  }
};
// Legacy registration function (for backward compatibility)
export const mockRegister = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  // This now redirects to the new OTP flow
  const initResult = await initiateRegistration(email, password, email.split('@')[0]);
  if (!initResult.success) {
    return { success: false, error: initResult.error };
  }
  
  // Return indication that OTP is required
  return { success: false, error: 'OTP_REQUIRED' };
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get all mock users (for demo purposes)
export const getMockUsers = (): User[] => {
  return mockUsers.map(user => ({ ...user })); // Return a copy
};

// Clear pending authentication (utility function)
export const clearPendingAuth = (email: string): void => {
  pendingAuth.delete(email);
};

// Check if there's a pending authentication
export const hasPendingAuth = (email: string): boolean => {
  return pendingAuth.has(email);
};

// Step 1: Initiate password reset process (send OTP)
export const forgotPassword = async (email: string): Promise<{ success: boolean; requiresOTP?: boolean; error?: string }> => {
  if (USE_BACKEND_API) {
    try {
      // Use backend API
      const result = await sendOTP(email, 'reset');
      
      if (result.success) {
        return { success: true, requiresOTP: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
      return { success: false, error: 'Failed to send reset code. Please try again.' };
    }
  } else {
    // Fallback to mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!email) {
      return { success: false, error: 'Email is required' };
    }

    if (!validateEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Check if user exists (for mock implementation)
    const existingUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (!existingUser) {
      return { success: false, error: 'No account found with this email address' };
    }

    return { success: true, requiresOTP: true };
  }
};

// Step 2: Reset password with OTP verification
export const resetPassword = async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
  if (USE_BACKEND_API) {
    try {
      // First verify OTP
      const otpResult = await verifyOTP(email, otp, 'reset');
      
      if (!otpResult.success) {
        return { success: false, error: otpResult.message };
      }

      // TODO: Implement actual password reset API call
      // In a real implementation, you would call a reset password API here
      // const resetResult = await resetPasswordAPI(email, newPassword, otp);
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error) {
      console.error('Reset password failed:', error);
      return { success: false, error: 'Password reset failed. Please try again.' };
    }
  } else {
    // Fallback to mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate inputs
    if (!email || !otp || !newPassword) {
      return { success: false, error: 'All fields are required' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    // Mock OTP verification (accept 123456 or any 6-digit code)
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, error: 'Invalid verification code' };
    }

    // Check if user exists
    const existingUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (!existingUser) {
      return { success: false, error: 'No account found with this email address' };
    }

    // Update password in mock storage
    mockPasswords[existingUser.email] = newPassword;

    return { success: true };
  }
};
