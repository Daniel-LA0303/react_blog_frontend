import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UITooltip = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        // Posiciona el tooltip arriba del elemento + offset del scroll global
        top: rect.top + window.scrollY - 6,
        left: rect.left + window.scrollX + rect.width / 2,
      });
      setShow(true);
    }
  };

  return (
    <span
      ref={triggerRef}
      style={{ display: 'inline-flex' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {show && (
              <motion.span
                initial={{ opacity: 0, y: 4, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-80%' }}
                exit={{ opacity: 0, y: 4, x: '-50%' }}
                transition={{ duration: 0.12 }}
                style={{
                  position: 'absolute',
                  top: coords.top,
                  left: coords.left,
                  transform: 'translate(-50%, -100%)', 
                  padding: '4px 8px',
                  borderRadius: 6,
                  background: '#111',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 9999, 
                }}
              >
                {title}
              </motion.span>
            )}
          </AnimatePresence>,
          document.body
        )}
    </span>
  );
};

export default UITooltip;