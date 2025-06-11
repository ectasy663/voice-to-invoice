import type { User } from '../types';

// Check if we should use the backend API
const USE_BACKEND_API = import.meta.env.VITE_USE_BACKEND_API === 'true';

// Base API URL - will be used when backend is available
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// User-related API calls (non-authentication)
export const userService = {
  /**
   * Get user profile information
   */
  getUserProfile: async (userId: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
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
        return { success: true, user: data.user };
      } catch (error) {
        console.error('Get user profile failed:', error);
        return { 
          success: false, 
          error: 'Failed to fetch user profile. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data based on userId
      const mockUser: User = {
        id: userId,
        email: 'user@example.com',
        name: 'Mock User'
      };

      return { success: true, user: mockUser };
    }
  },

  /**
   * Update user profile information
   */
  updateUserProfile: async (userId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, user: data.user };
      } catch (error) {
        console.error('Update user profile failed:', error);
        return { 
          success: false, 
          error: 'Failed to update profile. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful update
      const updatedUser: User = {
        id: userId,
        email: updates.email || 'user@example.com',
        name: updates.name || 'Updated User'
      };

      return { success: true, user: updatedUser };
    }
  },

  /**
   * Change user password
   */
  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
      } catch (error) {
        console.error('Change password failed:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to change password. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!currentPassword || !newPassword) {
        return { success: false, error: 'Both current and new passwords are required' };
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters long' };
      }

      // Mock success
      return { success: true };
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async (userId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
      } catch (error) {
        console.error('Delete account failed:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to delete account. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock validation
      if (!password) {
        return { success: false, error: 'Password is required to delete account' };
      }

      // Mock success
      return { success: true };
    }
  },

  /**
   * Get user statistics (for dashboard)
   */
  getUserStats: async (userId: string): Promise<{ success: boolean; stats?: any; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/stats`, {
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
        console.error('Get user stats failed:', error);
        return { 
          success: false, 
          error: 'Failed to fetch user statistics. Please try again.' 
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
        invoicesThisMonth: 8,
        revenueThisMonth: 3200.00,
        totalClients: 15,
        activeClients: 12,
        overdueInvoices: 3,
        paidInvoices: 39,
        lastLoginDate: new Date().toISOString(),
        accountCreatedDate: '2024-01-15T10:30:00Z'
      };

      return { success: true, stats: mockStats };
    }
  },

  /**
   * Get admin-only data (for admin users)
   */
  getAdminData: async (): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
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
        return { success: true, data: data.adminData };
      } catch (error) {
        console.error('Get admin data failed:', error);
        return { 
          success: false, 
          error: 'Failed to fetch admin data. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock admin data
      const mockAdminData = {
        totalUsers: 1247,
        newUsersToday: 23,
        newUsersThisWeek: 156,
        activeUsers: 892,
        totalInvoices: 8934,
        invoicesToday: 45,
        totalRevenue: 487650.00,
        revenueToday: 2340.00,
        serverStatus: 'healthy',
        databaseStatus: 'healthy',
        uptime: '99.97%'
      };

      return { success: true, data: mockAdminData };
    }
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (userId: string, file: File): Promise<{ success: boolean; avatarUrl?: string; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/avatar`, {
          method: 'POST',
          headers: {
            // Don't set Content-Type for FormData, let browser set it
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, avatarUrl: data.avatarUrl };
      } catch (error) {
        console.error('Upload avatar failed:', error);
        return { 
          success: false, 
          error: 'Failed to upload avatar. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock file validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { success: false, error: 'File size must be less than 5MB' };
      }

      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'File must be an image' };
      }

      // Mock successful upload
      const mockAvatarUrl = URL.createObjectURL(file);
      return { success: true, avatarUrl: mockAvatarUrl };
    }
  },

  /**
   * Get user preferences
   */
  getUserPreferences: async (userId: string): Promise<{ success: boolean; preferences?: any; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/preferences`, {
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
        return { success: true, preferences: data.preferences };
      } catch (error) {
        console.error('Get user preferences failed:', error);
        return { 
          success: false, 
          error: 'Failed to fetch user preferences. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Mock preferences
      const mockPreferences = {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        pushNotifications: false,
        invoiceReminders: true,
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        autoSave: true
      };

      return { success: true, preferences: mockPreferences };
    }
  },

  /**
   * Update user preferences
   */
  updateUserPreferences: async (userId: string, preferences: any): Promise<{ success: boolean; error?: string }> => {
    if (USE_BACKEND_API) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/preferences`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when implementing JWT
            // 'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(preferences),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { success: true };
      } catch (error) {
        console.error('Update user preferences failed:', error);
        return { 
          success: false, 
          error: 'Failed to update preferences. Please try again.' 
        };
      }
    } else {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock successful update
      return { success: true };
    }
  }
};

// Export individual functions for convenience
export const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  getUserStats,
  getAdminData,
  uploadAvatar,
  getUserPreferences,
  updateUserPreferences
} = userService;

export default userService;
