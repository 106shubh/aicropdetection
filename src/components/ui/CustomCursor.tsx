'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <motion.div
      className={styles.cursorWrapper}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isClicking ? 0.9 : isHovering ? 1.1 : 1,
        rotate: isHovering ? -10 : 0
      }}
      transition={{ 
        x: { type: 'tween', ease: 'linear', duration: 0 },
        y: { type: 'tween', ease: 'linear', duration: 0 },
        scale: { type: 'spring', mass: 0.1, stiffness: 150 },
        rotate: { type: 'spring', mass: 0.1, stiffness: 150 }
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill={isHovering ? "rgba(123, 176, 138, 0.4)" : "var(--color-muted-green)"}
        stroke={isHovering ? "#fff" : "#7bb08a"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.cursorArrow}
        style={{
          filter: isHovering ? 'drop-shadow(0 0 8px rgba(123, 176, 138, 0.8))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
        }}
      >
        <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
      </svg>
    </motion.div>
  );
}
