import React from 'react';

interface VoiceVisualizerProps {
  isRecording: boolean;
  isProcessing: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isRecording, isProcessing }) => {
  return (
    <div className="relative flex items-center justify-center h-32">
      {/* Central microphone */}
      <div
        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-500 to-pink-500' 
            : isProcessing
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
            : 'bg-gradient-to-r from-blue-500 to-purple-500'
        } shadow-2xl`}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>

      {/* Simple recording indicator */}
      {isRecording && (
        <div className="absolute w-20 h-20 border-2 border-red-400/50 rounded-full animate-pulse" />
      )}

      {/* Simple processing indicator */}
      {isProcessing && (
        <div className="absolute w-20 h-20 border-2 border-yellow-400/50 rounded-full border-t-transparent animate-spin" />
      )}
    </div>
  );
};

export default VoiceVisualizer;
