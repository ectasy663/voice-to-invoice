import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import OTPVerificationPage from './OTPVerificationPage';
import { completeLogin, completeRegistration, clearPendingAuth } from '../utils/auth';
import { resendOTP } from '../utils/otp';
import type { AuthState } from '../types';

interface AuthWrapperProps {
  onAuthSuccess: (authState: AuthState) => void;
}

export type AuthMode = 'login' | 'signup' | 'otp';

interface OTPState {
  email: string;
  type: 'login' | 'signup';
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [otpState, setOtpState] = useState<OTPState | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const switchToSignUp = () => {
    setAuthMode('signup');
    setOtpState(null);
    setOtpError(null);
  };

  const switchToLogin = () => {
    setAuthMode('login');
    setOtpState(null);
    setOtpError(null);
  };

  const handleRequireOTP = (email: string, type: 'login' | 'signup') => {
    setOtpState({ email, type });
    setAuthMode('otp');
    setOtpError(null);
  };  const handleCompleteAuthentication = async (otp: string) => {
    if (!otpState) return;

    try {
      setOtpError(null);
      let result;
      
      if (otpState.type === 'login') {
        result = await completeLogin(otpState.email, otp);
      } else {
        result = await completeRegistration(otpState.email, otp);
      }

      if (result.success && result.user) {
        onAuthSuccess({
          isAuthenticated: true,
          user: result.user,
          isLoading: false,
          error: null
        });
      } else {
        setOtpError(result.error || 'Verification failed');
        throw new Error(result.error || 'Verification failed');
      }
    } catch (error) {
      // Error is already set above or will be handled by the OTP page
      throw error;
    }
  };

  const handleResendOTP = async () => {
    if (!otpState) return;

    try {
      await resendOTP(otpState.email, otpState.type);
      setOtpError(null);
    } catch (error) {
      setOtpError('Failed to resend OTP. Please try again.');
    }
  };

  const handleGoBackFromOTP = () => {
    if (otpState) {
      clearPendingAuth(otpState.email);
    }
    
    if (otpState?.type === 'signup') {
      setAuthMode('signup');
    } else {
      setAuthMode('login');
    }
    
    setOtpState(null);
    setOtpError(null);
  };

  return (
    <AnimatePresence mode="wait">
      {authMode === 'login' ? (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage 
            onAuthSuccess={onAuthSuccess}
            onSwitchToSignUp={switchToSignUp}
            onRequireOTP={handleRequireOTP}
          />
        </motion.div>
      ) : authMode === 'signup' ? (
        <motion.div
          key="signup"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <SignUpPage 
            onAuthSuccess={onAuthSuccess}
            onSwitchToLogin={switchToLogin}
            onRequireOTP={handleRequireOTP}
          />
        </motion.div>
      ) : (
        <motion.div
          key="otp"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >          <OTPVerificationPage
            email={otpState?.email || ''}
            onVerificationSuccess={handleCompleteAuthentication}
            onResendOTP={handleResendOTP}
            onGoBack={handleGoBackFromOTP}
            error={otpError}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthWrapper;
