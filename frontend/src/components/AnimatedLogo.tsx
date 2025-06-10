import React from 'react';
import { motion } from 'framer-motion';
import { Mic, FileText, Zap } from 'lucide-react';

const AnimatedLogo: React.FC = () => {
  return (
    <motion.div
      className="relative mx-auto h-32 w-32 mb-8"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-600"
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
          padding: '4px',
          borderRadius: '50%'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full bg-white rounded-full" />
      </motion.div>

      {/* Center content */}
      <div className="absolute inset-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Mic className="w-8 h-8 text-white" />
          
          {/* Animated sound waves */}
          <motion.div
            className="absolute -right-6 top-1/2 transform -translate-y-1/2"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-white/60 rounded-full" />
              <div className="w-1 h-6 bg-white/60 rounded-full" />
              <div className="w-1 h-3 bg-white/60 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Orbiting icons */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <motion.div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
          <Zap className="w-4 h-4 text-yellow-800" />
        </motion.div>
        
        <motion.div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
          <FileText className="w-4 h-4 text-green-800" />
        </motion.div>
      </motion.div>

      {/* Pulsing glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-600/30 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default AnimatedLogo;
