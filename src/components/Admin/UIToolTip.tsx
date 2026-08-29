import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const UITooltip = ({ title, children }: { title: string; children: React.ReactNode }) => {

    const [show, setShow] = useState(false);

    return (
        <span
            style={{ position: 'relative', display: 'inline-flex' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            <AnimatePresence>
                {show && (
                    <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.12 }}
                        style={{
                            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                            marginBottom: 6, padding: '4px 8px', borderRadius: 6,
                            background: '#111', color: '#fff', fontSize: 11, fontWeight: 500,
                            whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
                        }}
                    >
                        {title}
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    )
}

export default UITooltip;