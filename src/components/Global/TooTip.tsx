import { useState } from "react";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
    const [show, setShow] = useState(false);
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onTouchStart={() => setShow(v => !v)}
            onTouchEnd={(e) => { e.preventDefault(); }}
        >
            {children}
            {show && (
                <div
                    className={`absolute bottom-full right-0 mb-2 z-50
                        ${dark ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-white'}
                        px-2 py-1 text-xs rounded-md pointer-events-none text-center`}
                    style={{ maxWidth: '200px', width: 'max-content' }}
                >
                    {text}
                    <div className={`absolute top-full right-3
                        border-4 border-transparent
                        ${dark ? 'border-t-gray-100' : 'border-t-gray-900'}`}
                    />
                </div>
            )}
        </div>
    )
}

export default Tooltip;