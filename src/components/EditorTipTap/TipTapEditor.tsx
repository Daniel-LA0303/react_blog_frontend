import React, { useState, useCallback, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { motion, AnimatePresence } from "framer-motion";
import ResizableImage from "./ResizebleImage";
import ImageInsertModal from "./ImageInsertModal";
import VideoInsertModal from "./VideoInsertModal";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";

const lowlight = createLowlight(common);

/* Toolbar button */
const ToolBtn = ({
    onClick, active = false, disabled = false, title, children, dark = false,
}: {
    onClick: () => void; active?: boolean; disabled?: boolean;
    title?: string; children: React.ReactNode; dark?: boolean;
}) => (
    <button type="button" title={title} disabled={disabled} onClick={onClick}
        className={`flex items-center justify-center w-7 h-7 rounded-md text-sm transition-colors
      disabled:opacity-30 disabled:cursor-not-allowed
      ${active
                ? "bg-[#2563EB] text-white"
                : dark
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}>
        {children}
    </button>
);

const Divider = ({ dark = false }: { dark?: boolean }) => (
    <div className={`w-px h-5 mx-1 shrink-0 ${dark ? "bg-gray-600" : "bg-gray-200"}`} />
);

const Ico = ({ d, size = 14 }: { d: string | string[]; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
);

/* ─── Color picker ──*/
const ColorBtn = ({
    title, value, onChange, children, dark = false,
}: {
    title: string; value: string; onChange: (c: string) => void;
    children: React.ReactNode; dark?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const [localColor, setLocalColor] = useState(value);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => { setLocalColor(value); }, [value]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <div ref={ref} className="relative flex items-center">
            <button type="button" title={title} onClick={() => setOpen(v => !v)}
                className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors cursor-pointer
          ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                {children}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.12 }}
                        className={`absolute top-9 left-0 z-30 border rounded-xl shadow-xl p-3
              flex flex-col gap-2 min-w-[140px]
              ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                    >
                        <p className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
                        <input
                            type="color"
                            value={localColor}
                            onInput={(e) => {
                                const c = (e.target as HTMLInputElement).value;
                                setLocalColor(c);
                                onChange(c);
                            }}
                            onChange={(e) => {
                                setLocalColor(e.target.value);
                                onChange(e.target.value);
                            }}
                            className="w-full h-9 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <div className="grid grid-cols-6 gap-1">
                            {[
                                "#111827", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6",
                                "#8b5cf6", "#ec4899", "#ffffff", "#6b7280", "#0ea5e9", "#14b8a6",
                            ].map(c => (
                                <button key={c} type="button"
                                    onClick={() => { setLocalColor(c); onChange(c); setOpen(false); }}
                                    style={{ background: c }}
                                    className={`w-5 h-5 rounded-full hover:scale-110 transition-transform cursor-pointer
                    ${dark ? "border border-gray-600" : "border border-gray-200"}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ─── Props ─────────*/
interface TipTapEditorProps {
    content: string;
    onContent: (val: string) => void;
    error?: string;
    onClearError?: () => void;
}

type Tab = "Write" | "Preview";

const TipTapEditor = ({ content, onContent, error, onClearError }: TipTapEditorProps) => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [tab, setTab] = useState<Tab>("Write");
    const [showImage, setShowImage] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [showLink, setShowLink] = useState(false);
    const [selectedImageAlign, setSelectedImageAlign] = useState<"left" | "center" | "right">("center");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            ResizableImage,
            Youtube.configure({ controls: true, nocookie: true }),
            Link.configure({ openOnClick: false }),
            Color,
            TextStyle,
            Highlight.configure({ multicolor: true }),
            Underline,
            Placeholder.configure({ placeholder: "Write something awesome..." }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Subscript,
            Superscript,
            CodeBlockLowlight.configure({ lowlight }),
        ],
        content: content || "",
        onUpdate({ editor }) {
            onContent(editor.getHTML());
            if (error && onClearError) onClearError();
        },
        editorProps: { attributes: { class: "tiptap-editor-area", spellcheck: "true" } },
    });

    const handleInsertImage = useCallback((url: string) => {
        editor?.chain().focus().setResizableImage({ src: url, width: 600 }).run();
    }, [editor]);

    const handleInsertVideo = useCallback((url: string) => {
        editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }, [editor]);

    const handleSetLink = useCallback(() => {
        if (!linkUrl.trim()) editor?.chain().focus().unsetLink().run();
        else editor?.chain().focus().setLink({ href: linkUrl.trim() }).run();
        setShowLink(false);
        setLinkUrl("");
    }, [editor, linkUrl]);

    useEffect(() => {
        if (!editor) return;
        const el = editor.view.dom as HTMLElement;
        el.classList.remove("tiptap-content--dark", "tiptap-content--light");
        el.classList.add(dark ? "tiptap-content--dark" : "tiptap-content--light");
    }, [dark, editor]);

    const handleImageAlign = useCallback((align: "left" | "center" | "right") => {
        if (!editor) return;
        const { state, view } = editor;
        const { from } = state.selection;
        let nodePos = -1;
        state.doc.nodesBetween(from - 1, from + 1, (node, pos) => {
            if (node.type.name === "resizableImage") nodePos = pos;
        });
        if (nodePos === -1) return;
        const marginMap = { left: "0 auto 0 0", center: "0 auto", right: "0 0 0 auto" };
        view.dispatch(state.tr.setNodeMarkup(nodePos, undefined, {
            ...state.doc.nodeAt(nodePos)?.attrs,
            style: `margin: ${marginMap[align]}; display: block;`,
        }));
        setSelectedImageAlign(align);
    }, [editor]);

    const isImageSelected = editor?.isActive("resizableImage") ?? false;

    if (!editor) return null;

    return (
        <>
            <div className="py-7">
                {/* ── Tab bar */}
                <div className={`flex items-center gap-1 px-1 pt-1 w-fit border-b
                    ${dark ? "border-gray-700 bg-[#0f0f0f]" : "border-gray-200 bg-transparent"}`}>
                        {(["Write", "Preview"] as Tab[]).map((t) => (
                        <button key={t} type="button" onClick={() => setTab(t)}
                            className={`relative px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                                ${tab === t
                                    ? "text-[#2563EB]"
                                    : dark
                                        ? "text-gray-500 hover:text-gray-300"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}>
                            {t}
                            {tab === t && (
                                <motion.div layoutId="tiptap-tab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    {tab === "Write" ? (
                        <motion.div key="write"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}>

                            {/* Editor box */}
                            <div className={`tiptap-wrapper rounded-b-xl rounded-tr-xl border-2 overflow-hidden
                                ${dark ? "border-gray-700 bg-[#27272A] text-white" : "border-gray-300 bg-white"}`}>

                                {/* ── Toolbar */}
                                <div className={`flex flex-wrap items-center gap-0.5 px-3 py-2
                                    border-b sticky top-0 z-10
                                    ${dark ? "bg-[#27272A] border-gray-700" : "bg-gray-50 border-gray-100"}`}>

                                    <ToolBtn dark={dark} title="Undo" onClick={() => editor.chain().focus().undo().run()}
                                        disabled={!editor.can().undo()}>
                                        <Ico d="M3 10h10a8 8 0 010 16H3M3 10l4-4M3 10l4 4" />
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Redo" onClick={() => editor.chain().focus().redo().run()}
                                        disabled={!editor.can().redo()}>
                                        <Ico d="M21 10H11a8 8 0 000 16h10M21 10l-4-4M21 10l-4 4" />
                                    </ToolBtn>

                                    <Divider dark={dark} />

                                    {([1, 2, 3] as (1 | 2 | 3)[]).map(level => (
                                        <ToolBtn key={level} dark={dark} title={`Heading ${level}`}
                                            active={editor.isActive("heading", { level })}
                                            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}>
                                            <span className="text-xs font-bold">H{level}</span>
                                        </ToolBtn>
                                    ))}
                                    <ToolBtn dark={dark} title="Paragraph" active={editor.isActive("paragraph")}
                                        onClick={() => editor.chain().focus().setParagraph().run()}>
                                        <span className="text-xs">¶</span>
                                    </ToolBtn>

                                    <Divider dark={dark} />

                                    <ToolBtn dark={dark} title="Bold" active={editor.isActive("bold")}
                                        onClick={() => editor.chain().focus().toggleBold().run()}>
                                        <span className="font-bold text-xs">B</span>
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Italic" active={editor.isActive("italic")}
                                        onClick={() => editor.chain().focus().toggleItalic().run()}>
                                        <span className="italic text-xs">I</span>
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Underline" active={editor.isActive("underline")}
                                        onClick={() => editor.chain().focus().toggleUnderline().run()}>
                                        <span className="underline text-xs">U</span>
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Strikethrough" active={editor.isActive("strike")}
                                        onClick={() => editor.chain().focus().toggleStrike().run()}>
                                        <span className="line-through text-xs">S</span>
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Subscript" active={editor.isActive("subscript")}
                                        onClick={() => editor.chain().focus().toggleSubscript().run()}>
                                        <span className="text-xs">X<sub>2</sub></span>
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Superscript" active={editor.isActive("superscript")}
                                        onClick={() => editor.chain().focus().toggleSuperscript().run()}>
                                        <span className="text-xs">X<sup>2</sup></span>
                                    </ToolBtn>

                                    <Divider dark={dark} />

                                    <ToolBtn dark={dark} title="Align left" active={editor.isActive({ textAlign: "left" })}
                                        onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                                        <Ico d="M3 6h18M3 12h12M3 18h15" />
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Align center" active={editor.isActive({ textAlign: "center" })}
                                        onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                                        <Ico d="M3 6h18M6 12h12M4 18h16" />
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Align right" active={editor.isActive({ textAlign: "right" })}
                                        onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                                        <Ico d="M3 6h18M9 12h12M6 18h15" />
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Justify" active={editor.isActive({ textAlign: "justify" })}
                                        onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                                        <Ico d="M3 6h18M3 12h18M3 18h18" />
                                    </ToolBtn>

                                    <Divider dark={dark} />

                                    <ToolBtn dark={dark} title="Bullet list" active={editor.isActive("bulletList")}
                                        onClick={() => editor.chain().focus().toggleBulletList().run()}>
                                        <Ico d={["M9 6h11", "M9 12h11", "M9 18h11", "M4 6h.01M4 12h.01M4 18h.01"]} />
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Ordered list" active={editor.isActive("orderedList")}
                                        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                                        <Ico d={["M10 6h11", "M10 12h11", "M10 18h11", "M4 6h.01", "M4 12h.01", "M4 18h.01"]} />
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Blockquote" active={editor.isActive("blockquote")}
                                        onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                                        <Ico d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                                    </ToolBtn>
                                    <ToolBtn dark={dark} title="Code block" active={editor.isActive("codeBlock")}
                                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                                        <Ico d={["M16 18l6-6-6-6", "M8 6l-6 6 6 6"]} />
                                    </ToolBtn>

                                    <Divider dark={dark} />

                                    <ColorBtn dark={dark} title="Text color"
                                        value={editor.getAttributes("textStyle").color || (dark ? "#e4e4e7" : "#111827")}
                                        onChange={(c) => editor.chain().focus().setColor(c).run()}>
                                        <span className="text-xs font-bold" style={{
                                            borderBottom: `3px solid ${editor.getAttributes("textStyle").color || (dark ? "#e4e4e7" : "#111827")}`,
                                            paddingBottom: "1px",
                                            color: dark ? "#e4e4e7" : "#111827",
                                        }}>A</span>
                                    </ColorBtn>

                                    <ColorBtn dark={dark} title="Highlight color"
                                        value={editor.getAttributes("highlight").color || "#fef08a"}
                                        onChange={(c) => editor.chain().focus().setHighlight({ color: c }).run()}>
                                        <span className="text-xs font-bold" style={{
                                            background: editor.getAttributes("highlight").color || "#fef08a",
                                            padding: "1px 3px", borderRadius: 2,
                                            color: "#111827",
                                        }}>H</span>
                                    </ColorBtn>

                                    <Divider dark={dark} />

                                    {/* Link */}
                                    <div className="relative">
                                        <ToolBtn dark={dark} title="Link" active={editor.isActive("link")}
                                            onClick={() => { setLinkUrl(editor.getAttributes("link").href || ""); setShowLink(v => !v); }}>
                                            <Ico d={["M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71",
                                                "M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"]} />
                                        </ToolBtn>
                                        <AnimatePresence>
                                            {showLink && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.12 }}
                                                    className={`absolute top-9 left-0 z-20 border rounded-xl shadow-lg p-3 flex gap-2 w-72
                                                        ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                                                    <input type="url" value={linkUrl} autoFocus
                                                        onChange={(e) => setLinkUrl(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && handleSetLink()}
                                                        placeholder="https://..."
                                                        className={`flex-1 text-xs border rounded-lg px-3 py-2
                                                                focus:outline-none focus:ring-2 focus:ring-[#2563EB]
                                                                ${dark
                                                                ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                                                                : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"}`} />
                                                    <button onClick={handleSetLink}
                                                        className="text-xs font-semibold text-white bg-[#2563EB]
                                                            hover:bg-[#1d4ed8] px-3 py-2 rounded-lg transition-colors">
                                                        Set
                                                    </button>
                                                    {editor.isActive("link") && (
                                                        <button onClick={() => { editor.chain().focus().unsetLink().run(); setShowLink(false); }}
                                                            className="text-xs font-semibold text-red-500 hover:text-red-400 px-2 py-2 rounded-lg">
                                                            Remove
                                                        </button>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <ToolBtn dark={dark} title="Insert image" onClick={() => setShowImage(true)}>
                                        <Ico d={["M4 16l4-4 4 4 4-6 4 6", "M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"]} />
                                    </ToolBtn>

                                    <AnimatePresence>
                                        {isImageSelected && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.15 }}
                                                className="flex items-center gap-0.5 overflow-hidden">
                                                <Divider dark={dark} />
                                                <ToolBtn dark={dark} title="Image align left" active={selectedImageAlign === "left"}
                                                    onClick={() => handleImageAlign("left")}>
                                                    <Ico d="M3 6h18M3 12h12M3 18h15" />
                                                </ToolBtn>
                                                <ToolBtn dark={dark} title="Image align center" active={selectedImageAlign === "center"}
                                                    onClick={() => handleImageAlign("center")}>
                                                    <Ico d="M3 6h18M6 12h12M4 18h16" />
                                                </ToolBtn>
                                                <ToolBtn dark={dark} title="Image align right" active={selectedImageAlign === "right"}
                                                    onClick={() => handleImageAlign("right")}>
                                                    <Ico d="M3 6h18M9 12h12M6 18h15" />
                                                </ToolBtn>
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    <ToolBtn dark={dark} title="Embed video" onClick={() => setShowVideo(true)}>
                                        <Ico d={["M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z",
                                            "M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"]} />
                                    </ToolBtn>

                                    <Divider dark={dark} />
                                    <ToolBtn dark={dark} title="Clear formatting"
                                        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
                                        <Ico d={["M6 20l12-16", "M17 20H7"]} />
                                    </ToolBtn>
                                </div>

                                {/* Editable area */}
                                <EditorContent
                                    editor={editor}
                                    className={`tiptap-content max-h-[600px] overflow-y-auto ${dark ? "tiptap-content--dark" : "tiptap-content--light"}`}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        /* Preview — always white */
                        <motion.div key="preview"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}>
                            <div className={`min-h-[400px] rounded-b-xl rounded-tr-xl border px-8 py-6
                                ${dark ? "bg-[#27272A] border-gray-700" : "bg-white border-gray-200"}`}>
                                {editor.isEmpty ? (
                                    <p className={`text-sm italic ${dark ? "text-gray-600" : "text-gray-400"}`}>
                                        Nothing to preview yet. Switch to Write and add some content.
                                    </p>
                                ) : (
                                    <div
                                        className={`post-content ${dark ? "post-content--dark text-white" : "post-content--light"}`}
                                        dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showImage && <ImageInsertModal onInsert={handleInsertImage} onClose={() => setShowImage(false)} />}
                {showVideo && <VideoInsertModal onInsert={handleInsertVideo} onClose={() => setShowVideo(false)} />}
            </AnimatePresence>
        </>
    );
};

export default TipTapEditor;