import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  LogIn, 
  Sparkles, 
  ArrowRight, 
  Shield,
  UserPlus
} from 'lucide-react';
import { initiateLogin, validateEmail } from '../utils/auth';
import { requestNotificationPermission } from '../utils/otp';
import type { AuthState } from '../types';

interface LoginPageProps {
  onAuthSuccess: (authState: AuthState) => void;
  onSwitchToSignUp: () => void;
  onRequireOTP: (email: string, type: 'login' | 'signup') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess, onSwitchToSignUp, onRequireOTP }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
    const handleFillDemoCredentials = () => {
    setEmail('test@thedemologounge.com');
    setPassword('test123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Client-side validation
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Request notification permission for OTP
      await requestNotificationPermission();

      // Initiate login process (this will send OTP)
      const result = await initiateLogin(email, password);

      if (result.success && result.requiresOTP) {
        // Save login preference if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        }

        // Navigate to OTP verification
        onRequireOTP(email, 'login');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <motion.div 
                  className="mx-auto w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <LogIn className="w-10 h-10 text-white" />
                </motion.div>
                  <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-1">
                    The Demo Lounge
                  </h1>
                  <p className="text-white/50 text-xs font-light italic mb-3">powered by gyannetra</p>
                  <p className="text-white/70 text-sm flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Sign in to access live demo
                    <Sparkles className="w-4 h-4" />
                  </p>
                </motion.div>
              </div>

              {/* Form */}
              <motion.form
                className="space-y-6"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="space-y-4">
                  {/* Email Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
                  </div>

                  {/* Password Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    className="text-sm text-blue-300 hover:text-blue-200 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-300 ${
                    isLoading 
                      ? 'bg-white/20 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing you in...
                    </div>                  ) : (
                    <div className="flex items-center gap-3">
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>{/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-white/60 text-sm mb-3">
                    Don't have an account yet?
                  </p>
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors duration-200 group"
                  >
                    <UserPlus className="w-4 h-4" />
                    Create a new account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.form>
            </div>
          </div>

          {/* Demo Credentials Section */}
          <motion.div
            className="mt-8 backdrop-blur-xl bg-green-500/10 rounded-2xl border border-green-500/20 shadow-2xl p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-300" />
                <h3 className="text-lg font-bold text-green-100">Demo Credentials</h3>
                <Shield className="w-5 h-5 text-green-300" />
              </div>
                <div className="space-y-3 text-sm">
                <div 
                  className="bg-green-500/20 rounded-lg p-3 border border-green-500/30 cursor-pointer hover:bg-green-500/30 transition-all duration-300"
                  onClick={handleFillDemoCredentials}
                >                  <p className="text-green-200 font-medium mb-1">Test Email:</p>
                  <p className="text-white font-mono bg-green-600/20 px-2 py-1 rounded">test@thedemologounge.com</p>
                </div>
                
                <div 
                  className="bg-green-500/20 rounded-lg p-3 border border-green-500/30 cursor-pointer hover:bg-green-500/30 transition-all duration-300"
                  onClick={handleFillDemoCredentials}
                >
                  <p className="text-green-200 font-medium mb-1">Test Password:</p>
                  <p className="text-white font-mono bg-green-600/20 px-2 py-1 rounded">test123</p>
                </div>
                
                <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                  <p className="text-blue-200 font-medium mb-1">OTP Code:</p>
                  <p className="text-white font-mono bg-blue-600/20 px-2 py-1 rounded">123456</p>
                  <p className="text-blue-200 text-xs mt-1">Use this code for OTP verification</p>
                </div>
              </div>
                <div className="mt-4 pt-3 border-t border-green-500/30">
                <p className="text-green-200 text-xs">
                  💡 Click the credentials above to quickly fill the form
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
