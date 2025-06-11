import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Key,
  Shield,
  Sparkles
} from 'lucide-react';
import { verifyOTP } from '../utils/apiService';
import AnimatedLogo from '../components/AnimatedLogo';
import FloatingElements from '../components/FloatingElements';

interface ResetPasswordPageProps {
  email: string;
  onBackToForgotPassword: () => void;
  onPasswordResetSuccess: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  email,
  onBackToForgotPassword,
  onPasswordResetSuccess
}) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'otp' | 'password'>('otp');

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    // Check password strength
    setPasswordStrength({
      hasMinLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    });
  }, [newPassword]);

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit verification code');
        return;
      }

      // Check if backend API is enabled
      const USE_BACKEND_API = import.meta.env.VITE_USE_BACKEND_API === 'true';

      if (USE_BACKEND_API) {
        // Use backend API to verify OTP
        const result = await verifyOTP(email, otp, 'reset');
        
        if (result.success) {
          setStep('password');
        } else {
          setError(result.message || 'Invalid verification code. Please try again.');
        }
      } else {
        // Mock implementation - simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In mock mode, accept 123456 or any 6-digit code
        if (otp === '123456' || otp.length === 6) {
          setStep('password');
        } else {
          setError('Invalid verification code. Use 123456 for demo.');
        }
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError('Verification failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Client-side validation
      if (!newPassword || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      // Check password strength
      const isStrongPassword = Object.values(passwordStrength).every(Boolean);
      if (!isStrongPassword) {
        setError('Password must meet all security requirements');
        return;
      }

      // Check if backend API is enabled
      const USE_BACKEND_API = import.meta.env.VITE_USE_BACKEND_API === 'true';

      if (USE_BACKEND_API) {
        // In a real implementation, you would call a reset password API here
        // For now, we'll simulate the API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // TODO: Implement actual password reset API call
        // const result = await resetPassword(email, newPassword, otp);
        
        setSuccess(true);
        setTimeout(() => {
          onPasswordResetSuccess();
        }, 2000);
      } else {
        // Mock implementation - simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setSuccess(true);
        setTimeout(() => {
          onPasswordResetSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setError('Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = (met: boolean) => {
    return met ? 'text-green-600' : 'text-gray-400';
  };

  const getPasswordStrengthIcon = (met: boolean) => {
    return met ? '✓' : '○';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingElements />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <AnimatedLogo />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {step === 'otp' ? 'Verify Code' : 'Set New Password'}
          </motion.h1>
          
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {step === 'otp' 
              ? `Enter the verification code sent to ${email}`
              : 'Create a strong new password for your account'
            }
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Password Reset Successful!
              </h3>
              
              <p className="text-gray-600 mb-4">
                Your password has been successfully updated.
              </p>
              
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </motion.div>
          ) : step === 'otp' ? (
            <motion.form
              key="otp-form"
              onSubmit={handleOTPSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* OTP Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit code sent to your email
                </p>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Verify Code
                  </>
                )}
              </motion.button>

              {/* Back Button */}
              <motion.button
                type="button"
                onClick={onBackToForgotPassword}
                className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="password-form"
              onSubmit={handlePasswordReset}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* New Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Password Strength Indicators */}
              {newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className={getPasswordStrengthColor(passwordStrength.hasMinLength)}>
                      {getPasswordStrengthIcon(passwordStrength.hasMinLength)} At least 8 characters
                    </div>
                    <div className={getPasswordStrengthColor(passwordStrength.hasUpperCase)}>
                      {getPasswordStrengthIcon(passwordStrength.hasUpperCase)} One uppercase letter
                    </div>
                    <div className={getPasswordStrengthColor(passwordStrength.hasLowerCase)}>
                      {getPasswordStrengthIcon(passwordStrength.hasLowerCase)} One lowercase letter
                    </div>
                    <div className={getPasswordStrengthColor(passwordStrength.hasNumber)}>
                      {getPasswordStrengthIcon(passwordStrength.hasNumber)} One number
                    </div>
                    <div className={getPasswordStrengthColor(passwordStrength.hasSpecialChar)}>
                      {getPasswordStrengthIcon(passwordStrength.hasSpecialChar)} One special character
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !Object.values(passwordStrength).every(Boolean) || newPassword !== confirmPassword}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
