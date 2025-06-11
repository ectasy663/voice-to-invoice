import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ArrowRight, 
  RefreshCw, 
  Mail, 
  CheckCircle, 
  Clock,
  ArrowLeft
} from 'lucide-react';

interface OTPVerificationPageProps {
  email: string;
  onVerificationSuccess: (otp: string) => Promise<void>;
  onResendOTP: () => void;
  onGoBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const OTPVerificationPage: React.FC<OTPVerificationPageProps> = ({
  email,
  onVerificationSuccess,
  onResendOTP,
  onGoBack,
  isLoading = false,
  error = null
}) => {  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && value) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };  const handleVerifyOTP = async (otpCode: string) => {
    setIsVerifying(true);

    try {
      // Call the parent verification function which handles the actual OTP verification
      await onVerificationSuccess(otpCode);
    } catch (err) {
      // Error handling will be done by the parent component
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };
  const handleResendOTP = () => {
    if (!canResend) return;
    
    setCanResend(false);
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    onResendOTP();
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      handleVerifyOTP(otpCode);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Glass morphism card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div 
                  className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent mb-2">
                    Verify Your Email
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-4">
                    <Mail className="w-4 h-4" />
                    <span>We've sent a 6-digit code to</span>
                  </div>
                  <div className="text-blue-300 font-medium text-sm">{email}</div>
                </motion.div>
              </div>              {/* Email Sent Info */}
              <motion.div
                className="mb-6 bg-blue-500/20 border border-blue-500/30 text-blue-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <div>
                    <strong>Email Sent!</strong> Check your inbox for the 6-digit verification code.
                    <br />
                    <span className="text-blue-200 text-xs">Don't forget to check your spam/junk folder if you don't see it.</span>
                  </div>
                </div>
              </motion.div>

              {/* Demo Note */}
              <motion.div
                className="mb-6 bg-green-500/20 border border-green-500/30 text-green-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <div>
                    <strong>Demo Mode:</strong> In simulation mode, a popup window will show the email content.
                    <br />
                    <span className="text-green-200 text-xs">For testing: You can also use code <span className="font-mono bg-green-600/30 px-1 rounded">123456</span></span>
                  </div>
                </div>
              </motion.div>

              {/* OTP Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {/* OTP Input Fields */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
                      disabled={isVerifying || isLoading}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    />
                  ))}
                </div>                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={otp.join('').length !== 6 || isVerifying || isLoading}
                  className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-300 ${
                    otp.join('').length !== 6 || isVerifying || isLoading
                      ? 'bg-white/20 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  }`}
                >
                  {isVerifying || isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      Verify OTP
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center space-y-3">
                  <div className="text-white/60 text-sm">
                    Didn't receive the code?
                  </div>
                  
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors duration-200 group"
                    >
                      <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                      Resend OTP
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                      <Clock className="w-4 h-4" />
                      Resend in {formatTime(countdown)}
                    </div>
                  )}
                </div>

                {/* Go Back Button */}
                <button
                  type="button"
                  onClick={onGoBack}
                  className="w-full flex items-center justify-center gap-2 py-3 text-white/70 hover:text-white text-sm transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </button>
              </motion.form>
            </div>
          </div>          {/* Info Section */}
          <motion.div 
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {/* Security Info */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="text-white/70 text-sm">
                🔒 Your security is our priority. This verification step helps protect your account.
              </div>
            </div>

            {/* Email Troubleshooting */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-white/80 text-sm">
                <div className="font-medium mb-2">📧 Didn't receive the email?</div>
                <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                  <li>Check your spam/junk folder</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Wait a few minutes as emails can be delayed</li>
                  <li>Click "Resend OTP" to get a new code</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
