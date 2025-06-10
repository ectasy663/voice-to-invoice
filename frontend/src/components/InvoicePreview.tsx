import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Sparkles, DollarSign, Calendar, User } from 'lucide-react';

interface InvoicePreviewProps {
  transcribedText: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onClear: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ 
  transcribedText, 
  isGenerating, 
  onGenerate, 
  onClear 
}) => {  return (
    <motion.div
      className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center"
            >
              <FileText className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">Invoice Preview</h3>
              <p className="text-white/70 text-sm">Generated from your voice</p>
            </div>
          </div>          <motion.div
            className="flex items-center gap-2 text-white/80"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI Powered</span>
          </motion.div>
        </div>
      </div>      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        {transcribedText ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Mock Invoice Data Extraction Display */}            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80 text-sm font-medium">Client</span>
                </div>
                <p className="text-white text-lg font-semibold">John Doe Inc.</p>
              </motion.div>

              <motion.div
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-white/80 text-sm font-medium">Amount</span>
                </div>
                <p className="text-white text-lg font-semibold">$1,250.00</p>
              </motion.div>

              <motion.div
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-white/80 text-sm font-medium">Due Date</span>
                </div>
                <p className="text-white text-lg font-semibold">30 days</p>
              </motion.div>
            </div>

            {/* Transcribed Text */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-medium mb-3">Transcribed Content:</h4>
              <p className="text-white/80 text-sm leading-relaxed bg-black/20 rounded-lg p-4">
                {transcribedText}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">              <motion.button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                  isGenerating
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Generate PDF
                  </>
                )}
              </motion.button>              <motion.button
                onClick={onClear}
                className="px-6 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Clear
              </motion.button>
            </div>
          </motion.div>
        ) : (          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-400/20 to-gray-600/20 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-white/50" />
            </div>
            <h3 className="text-xl font-semibold text-white/80 mb-2">No transcription yet</h3>
            <p className="text-white/60">Start recording to generate your invoice</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default InvoicePreview;
