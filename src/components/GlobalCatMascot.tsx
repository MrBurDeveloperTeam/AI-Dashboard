import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCat } from '../store/catStore';

export default function GlobalCatMascot() {
  const { catPos, isWalking, catDirection, setIsWalking, bubble, onCatClick } = useCat();
  // currentPos tracks the visual position in real-time
  const currentPos = React.useRef(catPos);

  // Calculate duration based on distance from where the cat IS CURRENTLY to the NEW target
  const dx = catPos.x - currentPos.current.x;
  const dy = catPos.y - currentPos.current.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Speed: 350 pixels per second
  const duration = distance > 0 ? distance / 150 : 0;

  return (
    <motion.div
      className="fixed flex flex-col items-center z-50 pointer-events-none"
      style={{
        left: 0,
        top: 0,
        translateX: '-50%',
        translateY: '-100%',
      }}
      initial={false}
      animate={{ x: catPos.x, y: catPos.y }}
      transition={{ type: 'tween', duration: duration, ease: 'linear' }}
      onUpdate={(latest) => {
        // Keep track of exactly where the cat is as it moves
        currentPos.current = { x: Number(latest.x), y: Number(latest.y) };
      }}
      onAnimationComplete={() => setIsWalking(false)}
    >
      <AnimatePresence mode="wait">
        {bubble}
      </AnimatePresence>

      <img
        src={isWalking ? '/images/catwalk.gif' : '/images/cat.gif'}
        alt="Mascot"
        className={`w-16 h-16 object-contain drop-shadow-md pointer-events-auto cursor-pointer ${
          catDirection === 'left' ? 'scale-x-[-1]' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onCatClick?.();
        }}
      />
    </motion.div>
  );
}
