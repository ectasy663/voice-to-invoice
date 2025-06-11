import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  FileText, 
  ArrowRight, 
  Users, 
  Building, 
  TrendingUp,
  ChevronRight,
  Zap,
  ChevronDown,
  Settings,
  User,
  LogOut,
  Bell,
  CreditCard
} from 'lucide-react';
import type { AuthState } from '../types';

interface UseCasesPageProps {
  authState: AuthState;
  onSelectUseCase: (useCase: string) => void;
  onLogout: () => void;
}

const UseCasesPage: React.FC<UseCasesPageProps> = ({ 
  authState, 
  onSelectUseCase, 
  onLogout 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);
  const useCases = [
    {
      id: 'voice-invoice',
      title: 'Voice Invoice Generator',
      description: 'Convert your voice recordings into professional invoices instantly using AI-powered speech recognition and smart formatting.',
      icon: Mic,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-500/20 to-purple-600/20',
      features: ['Speech-to-text conversion', 'Smart invoice formatting', 'PDF generation', 'Real-time processing'],
      popular: true
    },
    {
      id: 'document-assistant',
      title: 'Smart Document Assistant',
      description: 'AI-powered document analysis and generation. Upload documents, get summaries, and create new content with voice commands.',
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/20 to-teal-600/20',
      features: ['Document analysis', 'AI summarization', 'Voice commands', 'Multi-format support'],
      popular: false
    },
    {
      id: 'meeting-notes',
      title: 'Meeting Notes & Transcription',
      description: 'Automatically transcribe meetings, generate action items, and create structured meeting summaries with AI assistance.',
      icon: Users,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/20 to-red-600/20',
      features: ['Live transcription', 'Action item extraction', 'Meeting summaries', 'Team collaboration'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <motion.header
        className="relative z-20 backdrop-blur-xl bg-white/10 border-b border-white/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  TheSolutionZone
                </h1>
                <p className="text-white/60 text-sm">AI-Powered Solutions</p>
              </div>
            </motion.div>            {/* User Info & Actions */}
            <div className="flex items-center gap-6">              {/* Book Consultation CTA */}
              <motion.a
                href="https://schedule.fillout.com/t/3XsBwh8ipfus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-medium text-sm hover:from-emerald-600 hover:to-teal-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-emerald-400/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <span>Book Consultation</span>
              </motion.a>

              {/* User Profile Dropdown */}
              <motion.div
                ref={dropdownRef}
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {authState.user?.name?.[0] || authState.user?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {authState.user?.name || authState.user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 backdrop-blur-2xl bg-gray-900/95 border-2 border-white/30 rounded-2xl shadow-2xl z-[9999]"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.96) 50%, rgba(51, 65, 85, 0.94) 100%)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      }}
                    >                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-slate-800/60 to-slate-700/60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center ring-2 ring-white/20">
                            <span className="text-white font-medium">
                              {authState.user?.name?.[0] || authState.user?.email?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {authState.user?.name || 'User'}
                            </p>
                            <p className="text-gray-300 text-xs">
                              {authState.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>                      {/* Menu Items */}
                      <div className="py-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-200 rounded-lg mx-2">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium">Account Settings</span>
                        </button>
                        
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-200 rounded-lg mx-2">
                          <Settings className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium">Preferences</span>
                        </button>
                        
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-200 rounded-lg mx-2">
                          <Bell className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium">Notifications</span>
                        </button>
                        
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-200 rounded-lg mx-2">
                          <CreditCard className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium">Billing</span>
                        </button>
                        
                        <div className="border-t border-white/20 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 transition-all duration-200 rounded-lg mx-2 font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">        {/* Welcome Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
            Explore Our Use Cases
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Discover powerful AI-driven solutions designed to transform how you work with documents, 
            voice recordings, and business processes. Choose your preferred use case to get started.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            
            return (
              <motion.div
                key={useCase.id}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Popular Badge */}
                {useCase.popular && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`relative h-full backdrop-blur-xl bg-gradient-to-br ${useCase.bgGradient} rounded-3xl border border-white/20 shadow-2xl p-8 cursor-pointer transition-all duration-500 group-hover:border-white/40 group-hover:shadow-3xl overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${useCase.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors">
                      {useCase.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 mb-6 leading-relaxed">
                      {useCase.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-8">
                      {useCase.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-white/60 text-sm">
                          <ChevronRight className="w-4 h-4 text-emerald-400" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onSelectUseCase(useCase.id)}
                      className={`w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r ${useCase.gradient} text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: '🚀', label: 'Active Users', value: '10,000+', color: 'from-blue-500 to-cyan-500' },
            { icon: '⚡', label: 'Documents Processed', value: '500K+', color: 'from-purple-500 to-pink-500' },
            { icon: '🎯', label: 'Accuracy Rate', value: '99.2%', color: 'from-emerald-500 to-teal-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Teaser */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/20 p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-300" />
              <h3 className="text-xl font-bold text-white">More Use Cases Coming Soon</h3>
              <Building className="w-6 h-6 text-purple-300" />
            </div>
            <p className="text-white/70 max-w-2xl mx-auto">
              We're constantly expanding our AI capabilities. Stay tuned for more exciting use cases including 
              contract analysis, expense management, and automated reporting tools.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UseCasesPage;
