import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion, AnimatePresence } from "framer-motion";

import { QuillToolbar, modules, formats } from "./EditorToolBar";
import PostContent from "./PostContent";

interface Props {
  content: string;
  onContent: (val: string) => void;
  error?: string;
  onClearError?: () => void;
  dark?: boolean;
}

type Tab = "Write" | "Preview";

const EditorWithPreview = ({ content, onContent, error, onClearError, dark = false }: Props) => {
  const [tab, setTab] = useState<Tab>("Write");

  const handleChange = (val: string) => {
    onContent(val);
    if (error && onClearError) onClearError();
  };

  return (
    <motion.div className="py-7">
      <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        Content
      </p>

      {/* Tab bar */}
      <div className={`flex items-center gap-1 px-1 pt-1 w-fit border-b mb-0 ${dark ? "border-gray-700" : "border-gray-200"}`}>
        {(["Write", "Preview"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`relative px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-150
              ${tab === t
                ? dark ? "text-white" : "text-gray-900"
                : dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {t}
            {tab === t && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {tab === "Write" ? (
          <motion.div
            key="write"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* ✅ quill-wrapper--dark added when dark mode is active */}
            <div className={`quill-wrapper rounded-b-xl rounded-tr-xl ${dark ? "quill-wrapper--dark" : ""}`}>
              <QuillToolbar toolbarId="t1" />
              <ReactQuill
                theme="snow"
                value={content}
                onChange={handleChange}
                placeholder="Write something awesome..."
                modules={modules("t1")}
                formats={formats}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className={`min-h-[360px] rounded-b-xl rounded-tr-xl border px-8 py-6
              ${dark ? "bg-[#141414] border-gray-700" : "bg-white border-gray-200"}`}
            >
              {content && content !== "<p><br></p>" ? (
                <PostContent html={content} dark={dark} />
              ) : (
                <p className={`text-sm italic ${dark ? "text-gray-600" : "text-gray-400"}`}>
                  Nothing to preview yet. Switch to Write and add some content.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditorWithPreview;