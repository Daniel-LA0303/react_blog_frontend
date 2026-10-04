import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";

const GAP = 8;      
const MARGIN = 8;   

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
    const [show, setShow] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(null);
    const [arrowLeft, setArrowLeft] = useState(0);

    const triggerRef = useRef<HTMLDivElement>(null);
    const tipRef = useRef<HTMLDivElement>(null);

    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    useLayoutEffect(() => {
        if (!show || !triggerRef.current || !tipRef.current) return;

        const t = triggerRef.current.getBoundingClientRect();
        const tip = tipRef.current.getBoundingClientRect();
        const centerX = t.left + t.width / 2;
        let left = centerX - tip.width / 2;
        left = Math.max(MARGIN, Math.min(left, window.innerWidth - tip.width - MARGIN));


        const fitsTop = t.top - tip.height - GAP >= MARGIN;
        const placement = fitsTop ? 'top' : 'bottom';
        const top = fitsTop ? t.top - tip.height - GAP : t.bottom + GAP;

        setPos({ top, left, placement });
        setArrowLeft(centerX - left);
    }, [show, text]);


    useLayoutEffect(() => {
        if (!show) return;
        const close = () => setShow(false);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [show]);

    const hide = () => { setShow(false); setPos(null); };

    return (
        <div
            ref={triggerRef}
            className="relative inline-flex"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={hide}
            onTouchStart={() => setShow(v => !v)}
            onTouchEnd={(e) => { e.preventDefault(); }}
        >
            {children}

            {show && createPortal(
                <div
                    ref={tipRef}
                    role="tooltip"
                    className={`fixed pointer-events-none text-center px-2 py-1 text-xs rounded-md
                        ${dark ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-white'}`}
                    style={{
                        top: pos?.top ?? 0,
                        left: pos?.left ?? 0,
                        zIndex: 1400,                      
                        maxWidth: 200,
                        width: 'max-content',
                        visibility: pos ? 'visible' : 'hidden', 
                    }}
                >
                    {text}
                    <div
                        className="absolute border-4 border-transparent"
                        style={{
                            left: arrowLeft,
                            transform: 'translateX(-50%)',
                            ...(pos?.placement === 'bottom'
                                ? { bottom: '100%', borderBottomColor: dark ? '#f3f4f6' : '#111827' }
                                : { top: '100%', borderTopColor: dark ? '#f3f4f6' : '#111827' }),
                        }}
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default Tooltip;