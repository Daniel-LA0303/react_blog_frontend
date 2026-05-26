import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clientAuthAxios from "../../services/clientAuthAxios";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";

interface Props {
  onInsert: (url: string) => void;
  onClose:  () => void;
}

type Tab = "url" | "upload";

const ImageInsertModal = ({ onInsert, onClose }: Props) => {
  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;
  const [tab,       setTab]       = useState<Tab>("upload");
  const [url,       setUrl]       = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [error,     setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await clientAuthAxios.post("/posts/image-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreview(res.data.secure_url);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    const finalUrl = tab === "upload" ? preview : url.trim();
    if (!finalUrl) { setError("Please provide an image"); return; }
    onInsert(finalUrl);
    onClose();
  };

  // Shorthand classes
  const modal   = dark ? "bg-[#1a1a1a] border border-gray-700"        : "bg-white";
  const header  = dark ? "border-gray-700"                             : "border-gray-100";
  const title   = dark ? "text-gray-100"                               : "text-gray-900";
  const close   = dark ? "text-gray-500 hover:text-gray-300"           : "text-gray-400 hover:text-gray-600";
  const tabBar  = dark ? "border-gray-700"                             : "border-gray-100";
  const tabInactive = dark ? "text-gray-500 hover:text-gray-300"       : "text-gray-400 hover:text-gray-600";
  const dropzone = dark
    ? "border-gray-600 hover:border-[#2563EB] hover:bg-[#1e2a45]"
    : "border-gray-200 hover:border-[#2563EB] hover:bg-blue-50";
  const dropText  = dark ? "text-gray-300"  : "text-gray-600";
  const dropSub   = dark ? "text-gray-500"  : "text-gray-400";
  const inputCls  = dark
    ? "bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-600 focus:ring-[#2563EB]"
    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-300 focus:ring-[#2563EB]";
  const cancelBtn = dark
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-200 text-gray-600 hover:bg-gray-50";

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
        className={`rounded-2xl shadow-2xl w-full max-w-md overflow-hidden ${modal}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${header}`}>
          <h3 className={`text-sm font-semibold ${title}`}>Insert Image</h3>
          <button onClick={onClose} className={`transition-colors ${close}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${tabBar}`}>
          {([["upload", "Upload from device"], ["url", "Insert from URL"]] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 -mb-px
                ${tab === t
                  ? "border-[#2563EB] text-[#2563EB]"
                  : `border-transparent ${tabInactive}`
                }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          <AnimatePresence mode="wait" initial={false}>
            {tab === "upload" ? (
              <motion.div key="upload"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }} className="space-y-3">
                <div onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dropzone}`}>
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-8 w-8 text-[#2563EB]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                      </svg>
                      <p className={`text-xs ${dropSub}`}>Uploading to Cloudinary...</p>
                    </div>
                  ) : preview ? (
                    <div className="space-y-2">
                      <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                      <p className="text-xs text-green-500 font-medium">✓ Uploaded successfully</p>
                      <p className={`text-xs ${dropSub}`}>Click to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className={`mx-auto h-10 w-10 ${dark ? "text-gray-600" : "text-gray-300"}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16l4-4 4 4 4-6 4 6M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <p className={`text-sm font-medium ${dropText}`}>Click to choose an image</p>
                      <p className={`text-xs ${dropSub}`}>PNG, JPG, GIF, WebP</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*"
                  className="hidden" onChange={handleFileChange} />
              </motion.div>
            ) : (
              <motion.div key="url"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }} className="space-y-3">
                <input type="url" value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full border rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:border-transparent ${inputCls}`}
                  autoFocus />
                {url && (
                  <img src={url} alt="preview" onError={() => setError("Invalid image URL")}
                    className={`max-h-40 w-full object-contain rounded-xl border
                      ${dark ? "border-gray-700" : "border-gray-100"}`} />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${cancelBtn}`}>
              Cancel
            </button>
            <button onClick={handleConfirm}
              disabled={uploading || (tab === "upload" ? !preview : !url.trim())}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Insert Image
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageInsertModal;