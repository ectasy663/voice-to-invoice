import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements: React.FC = () => {
  const elements = [
    { icon: '🎤', delay: 0, x: '10%', y: '20%' },
    { icon: '📄', delay: 0.5, x: '85%', y: '15%' },
    { icon: '💼', delay: 1, x: '15%', y: '70%' },
    { icon: '✨', delay: 1.5, x: '80%', y: '75%' },
    { icon: '🎯', delay: 2, x: '90%', y: '45%' },
    { icon: '📊', delay: 2.5, x: '5%', y: '45%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-20"
          style={{ left: element.x, top: element.y }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: [0, 360],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 3,
            delay: element.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
