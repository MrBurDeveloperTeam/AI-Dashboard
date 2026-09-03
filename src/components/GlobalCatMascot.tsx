import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCat } from '../store/catStore';

// mallow-spritesheet.webp: 8 columns x 9 rows, 192x208px per frame
const FRAME_WIDTH = 192;
const FRAME_HEIGHT = 208;
const SHEET_COLUMNS = 8;
const SHEET_ROWS = 9;
const SCALE = 0.42; // keeps rendered size close to the previous w-16 h-16 GIF

const SPRITE_ROWS = {
  idle: { row: 0, frames: 6, duration: '1.1s' },
  runRight: { row: 1, frames: 8, duration: '0.7s' },
  runLeft: { row: 2, frames: 8, duration: '0.7s' },
  wave: { row: 3, frames: 4, duration: '0.8s' },
} as const;

const WAVE_DURATION_MS = 800;

// One keyframe per distinct frame count, with the "to" endpoint baked in.
// Setting a fresh `animation` shorthand (below) whenever the keyframe name
// changes reliably restarts the animation clock — unlike driving the same
// keyframe via CSS custom properties, which browsers won't reset mid-flight.
const SPRITE_KEYFRAMES = `
  @keyframes mallow-cat-sprite-6 {
    from { background-position-x: 0; }
    to { background-position-x: -${6 * FRAME_WIDTH * SCALE}px; }
  }
  @keyframes mallow-cat-sprite-8 {
    from { background-position-x: 0; }
    to { background-position-x: -${8 * FRAME_WIDTH * SCALE}px; }
  }
  @keyframes mallow-cat-sprite-4 {
    from { background-position-x: 0; }
    to { background-position-x: -${4 * FRAME_WIDTH * SCALE}px; }
  }
`;

export default function GlobalCatMascot() {
  const { catPos, isWalking, catDirection, setIsWalking, bubble, onCatClick } = useCat();
  // currentPos tracks the visual position in real-time
  const currentPos = React.useRef(catPos);
  const [isWaving, setIsWaving] = React.useState(false);
  const waveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Calculate duration based on distance from where the cat IS CURRENTLY to the NEW target
  const dx = catPos.x - currentPos.current.x;
  const dy = catPos.y - currentPos.current.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Speed: 350 pixels per second
  const duration = distance > 0 ? distance / 150 : 0;

  React.useEffect(() => {
    return () => {
      if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
    };
  }, []);

  const spriteState = isWalking
    ? catDirection === 'left'
      ? 'runLeft'
      : 'runRight'
    : isWaving
      ? 'wave'
      : 'idle';
  const sprite = SPRITE_ROWS[spriteState];

  const animation =
    spriteState === 'wave'
      ? `mallow-cat-sprite-${sprite.frames} ${sprite.duration} steps(${sprite.frames - 1}, end) 1 forwards`
      : `mallow-cat-sprite-${sprite.frames} ${sprite.duration} steps(${sprite.frames}) infinite`;

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

      <style>{SPRITE_KEYFRAMES}</style>

      <div
        className="mallow-cat-mascot object-contain drop-shadow-md pointer-events-auto cursor-pointer"
        style={{
          width: FRAME_WIDTH * SCALE,
          height: FRAME_HEIGHT * SCALE,
          backgroundImage: "url('/images/mallow-spritesheet.webp')",
          backgroundSize: `${FRAME_WIDTH * SHEET_COLUMNS * SCALE}px ${FRAME_HEIGHT * SHEET_ROWS * SCALE}px`,
          backgroundPositionY: -sprite.row * FRAME_HEIGHT * SCALE,
          animation,
        }}
        role="img"
        aria-label="Mascot"
        onClick={(e) => {
          e.stopPropagation();
          if (!isWalking) {
            setIsWaving(true);
            if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
            waveTimeoutRef.current = setTimeout(() => setIsWaving(false), WAVE_DURATION_MS);
          }
          onCatClick?.();
        }}
      />
    </motion.div>
  );
}
