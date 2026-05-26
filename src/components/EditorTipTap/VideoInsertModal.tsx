import React, { useState } from "react";
import { motion } from "framer-motion";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";

interface Props {
  onInsert: (url: string) => void;
  onClose:  () => void;
}

const VideoInsertModal = ({ onInsert, onClose }: Props) => {
  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;

  const [url,   setUrl]   = useState("");
  const [error, setError] = useState("");

  const isValid = (u: string) => /youtube\.com|youtu\.be|vimeo\.com/.test(u);

  const handleConfirm = () => {
    const trimmed = url.trim();
    if (!trimmed)          { setError("Please enter a video URL"); return; }
    if (!isValid(trimmed)) { setError("Only YouTube and Vimeo URLs are supported"); return; }
    onInsert(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{   opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18 }}
        onClick={(e: any) => e.stopPropagation()}
        className={`rounded-2xl shadow-2xl w-full max-w-md overflow-hidden
          ${dark ? "bg-[#1a1a1a] border border-gray-700" : "bg-white"}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b
          ${dark ? "border-gray-700" : "border-gray-100"}`}>
          <h3 className={`text-sm font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}>
            Embed Video
          </h3>
          <button onClick={onClose}
            className={`transition-colors ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <label className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>
              YouTube or Vimeo URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="https://www.youtube.com/watch?v=..."
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              className={`w-full border rounded-xl px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent
                ${dark
                  ? "bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-600"
                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-300"
                }`}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2">
            <button onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors
                ${dark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}>
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={!url.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors">
              Embed
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoInsertModal;