import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

interface CatContextType {
  catPos: { x: number; y: number };
  isWalking: boolean;
  catDirection: 'left' | 'right';
  setIsWalking: (walking: boolean) => void;
  /** Register a bubble element to show above the cat */
  bubble: React.ReactNode;
  setBubble: (node: React.ReactNode) => void;
  /** Register an onCatClick handler for the active page */
  onCatClick: (() => void) | undefined;
  setOnCatClick: (fn: (() => void) | undefined) => void;
}

const CatContext = createContext<CatContextType | null>(null);

export function CatProvider({ children }: { children: React.ReactNode }) {
  const [catPos, setCatPos] = useState({ x: 192, y: 400 });
  const [isWalking, setIsWalking] = useState(false);
  const [catDirection, setCatDirection] = useState<'left' | 'right'>('right');
  const [bubble, setBubble] = useState<React.ReactNode>(null);
  const [onCatClick, setOnCatClick] = useState<(() => void) | undefined>(undefined);
  const catPosRef = useRef(catPos);

  useEffect(() => {
    catPosRef.current = catPos;
  }, [catPos]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('.cursor-pointer')
      ) {
        return;
      }

      const x = e.clientX;
      const y = e.clientY;

      setCatDirection(x < catPosRef.current.x ? 'left' : 'right');
      setCatPos({ x, y });
      setIsWalking(true);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <CatContext.Provider value={{
      catPos, isWalking, catDirection,
      setIsWalking,
      bubble, setBubble,
      onCatClick, setOnCatClick,
    }}>
      {children}
    </CatContext.Provider>
  );
}

export function useCat() {
  const ctx = useContext(CatContext);
  if (!ctx) throw new Error('useCat must be used within CatProvider');
  return ctx;
}
