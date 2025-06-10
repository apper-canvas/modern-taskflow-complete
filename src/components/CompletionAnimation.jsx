import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CompletionAnimation = ({ position, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30) * (Math.PI / 180);
    const distance = 60 + Math.random() * 40;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    return {
      id: i,
      x,
      y,
      color: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#5B4FE9', '#8B7FFF', '#4DABF7'][i % 6],
      delay: i * 0.05
    };
  });

  return (
    <div
      className="fixed pointer-events-none z-[1000]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Central burst */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 0] }}
        transition={{ duration: 0.6 }}
        className="absolute w-8 h-8 bg-success rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(78, 205, 196, 0.8)'
        }}
      />

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1
          }}
          animate={{ 
            scale: [0, 1, 0],
            x: particle.x,
            y: particle.y,
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 0.8,
            delay: particle.delay,
            ease: "easeOut"
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color
          }}
        />
      ))}

      {/* Success text */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200"
      >
        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
          🎉 Task completed!
        </p>
      </motion.div>
    </div>
  );
};

export default CompletionAnimation;