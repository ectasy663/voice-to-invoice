import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  LogOut,
  Settings,
  Zap,
  Volume2,
  Sparkles,
  Shield,
  User,
  ChevronDown,
  Bell
} from 'lucide-react';
import type { AuthState, RecordingState } from '../types';
import {
  checkMediaRecordingSupport,
  requestMicrophonePermission,
  mockTranscribeVoice,
  generateInvoicePDF
} from '../utils/voice';
import VoiceVisualizer from '../components/VoiceVisualizer';
import InvoicePreview from '../components/InvoicePreview';

interface MainAppPageProps {
  authState: AuthState;
  onLogout: () => void;
  onGoToUseCases: () => void;
}

const MainAppPage: React.FC<MainAppPageProps> = ({ authState, onLogout, onGoToUseCases }) => {
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
  }, [isDropdownOpen]); const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isProcessing: false,
    transcribedText: '',
    error: null
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if browser supports media recording
    if (!checkMediaRecordingSupport()) {
      setRecordingState(prev => ({
        ...prev,
        error: 'Your browser does not support voice recording. Please use a modern browser like Chrome, Firefox, or Safari.'
      }));
    }

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setRecordingState(prev => ({ ...prev, error: null }));

      const stream = await requestMicrophonePermission();
      if (!stream) {
        setRecordingState(prev => ({
          ...prev,
          error: 'Microphone permission denied. Please allow microphone access and try again.'
        }));
        return;
      }

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setRecordingState(prev => ({
          ...prev,
          isRecording: false,
          isProcessing: true
        }));

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const transcribedText = await mockTranscribeVoice(audioBlob);

          setRecordingState(prev => ({
            ...prev,
            isProcessing: false,
            transcribedText
          }));
        } catch (error) {
          setRecordingState(prev => ({
            ...prev,
            isProcessing: false,
            error: 'Failed to transcribe voice. Please try again.'
          }));
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        error: null
      }));

    } catch (error) {
      setRecordingState(prev => ({
        ...prev,
        error: 'Failed to start recording. Please check your microphone permissions.'
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleGeneratePDF = async () => {
    if (!recordingState.transcribedText) return;

    setIsGeneratingPDF(true);
    try {
      await generateInvoicePDF(recordingState.transcribedText);
    } catch (error) {
      setRecordingState(prev => ({
        ...prev,
        error: 'Failed to generate PDF. Please try again.'
      }));
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const clearTranscription = () => {
    setRecordingState(prev => ({
      ...prev,
      transcribedText: '',
      error: null
    }));
  }; return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <motion.header
        className="relative z-20 backdrop-blur-xl bg-white/10 border-b border-white/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">            {/* Logo */}
            <motion.button
              onClick={onGoToUseCases}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-300"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  The Demo Lounge
                </h1>
                <p className="text-white/50 text-xs font-light italic">powered by gyannetra</p>
                <p className="text-white/60 text-sm">AI-Powered Solution</p>
              </div>
            </motion.button>{/* User Info & Actions */}
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
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
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
                        </button>                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-200 rounded-lg mx-2">
                          <Bell className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium">Notifications</span>
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">

          {/* Recording Section */}
          <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >            {/* Recording Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/20 mb-4">
                  <Volume2 className="w-4 h-4 text-white" />
                  <span className="text-white/80 text-sm font-medium">Voice Recording Studio</span>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Speak Your Invoice</h2>
                <p className="text-white/70">Click record and describe your invoice details naturally</p>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {recordingState.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="mb-6 bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {recordingState.error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Voice Visualizer */}
              <div className="flex-1 flex items-center justify-center">
                <VoiceVisualizer
                  isRecording={recordingState.isRecording}
                  isProcessing={recordingState.isProcessing}
                />
              </div>

              {/* Status Display */}
              <div className="text-center mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${recordingState.isRecording}-${recordingState.isProcessing}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-white/80"
                  >
                    {recordingState.isRecording ? (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-red-300">🔴 Recording in progress...</p>
                        <p className="text-sm">Speak clearly about your invoice details</p>
                      </div>
                    ) : recordingState.isProcessing ? (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-yellow-300">⚡ Processing your voice...</p>
                        <p className="text-sm">AI is analyzing your speech</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Ready to record</p>
                        <p className="text-sm">Click the button below to start</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>              {/* Control Buttons */}
              <div className="flex justify-center gap-4">
                {!recordingState.isRecording ? (
                  <motion.button
                    onClick={startRecording}
                    disabled={recordingState.isProcessing} className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-300 ${recordingState.isProcessing
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      }`}
                  >
                    <Mic className="w-6 h-6 transition-transform" />
                    Start Recording
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={stopRecording}
                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-medium text-lg hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <MicOff className="w-6 h-6 transition-transform" />
                    Stop Recording
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>          {/* Invoice Preview Section */}
          <motion.div
            className="h-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <InvoicePreview
              transcribedText={recordingState.transcribedText}
              isGenerating={isGeneratingPDF}
              onGenerate={handleGeneratePDF}
              onClear={clearTranscription} />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: '🎤', label: 'Voice Sessions', value: '1,234', color: 'from-blue-500 to-cyan-500' },
            { icon: '📄', label: 'Invoices Generated', value: '856', color: 'from-blue-500 to-indigo-500' },
            { icon: '🎯', label: 'Accuracy Rate', value: '97.8%', color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 text-center"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default MainAppPage;
