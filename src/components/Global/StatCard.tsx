import { useInView, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fadeUp } from "../../utils/animationsUtils";


const StatCard = ({
    label, value, icon, dark, delay,
}: {
    label: string; value: number; icon: React.ReactNode; dark: boolean; delay: number
}) => {

    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView || value === 0) return
        let v = 0
        const step = Math.ceil(value / 30)
        const t = setInterval(() => {
            v += step
            if (v >= value) { setCount(value); clearInterval(t) }
            else setCount(v)
        }, 20)
        return () => clearInterval(t)
    }, [inView, value])
    return (
        <motion.div
            ref={ref}
            variants={fadeUp}
            custom={delay}
            className={`rounded-2xl border p-5 flex items-center gap-4 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
                }`}
        >
            <div style={{
                width: 44, height: 44, borderRadius: 12, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
            }}>
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                    {label}
                </p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 500, lineHeight: 1.2, color: dark ? '#fff' : '#111' }}>
                    {count}
                </p>
            </div>
        </motion.div>
    )
}

export default StatCard;