// AIResponseModal.tsx
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOOL_META: Record<string, { label: string; icon: string; color: string }> = {
    aiSummaries: { label: 'AI Summary', icon: 'ti-text-wrap', color: '#2563EB' },
    chatWithArticles: { label: 'Chat with article', icon: 'ti-message-dots', color: '#2563EB' },
    aiTranslation: { label: 'AI Translation', icon: 'ti-language', color: '#2563EB' },
    writingAssistant: { label: 'Writing assistant', icon: 'ti-pencil', color: '#2563EB' },
    titleGeneration: { label: 'Title suggestions', icon: 'ti-heading', color: '#2563EB' },
    seoAssistant: { label: 'SEO assistant', icon: 'ti-chart-bar', color: '#2563EB' },
    tagGeneration: { label: 'Tag suggestions', icon: 'ti-tag', color: '#2563EB' },
    aiCovers: { label: 'AI covers', icon: 'ti-photo', color: '#7c3aed' },
    notesToArticle: { label: 'Notes to article', icon: 'ti-notes', color: '#7c3aed' },
    custom: { label: 'Custom prompt', icon: 'ti-sparkles', color: '#2563EB' },
}

const SIMULATED_RESPONSES: Record<string, string> = {
    aiSummaries: `This article explores the core principles of modern software architecture, focusing on scalability and maintainability. The author covers three main topics: microservices design patterns, database optimization strategies, and the role of observability in production systems.\n\nKey takeaways:\n• Microservices should be designed around business domains, not technical layers.\n• Database indexing strategies can reduce query time by up to 80% in common patterns.\n• Observability is not optional — it's a first-class concern in distributed systems.`,
    chatWithArticles: `I've read the article and I'm ready to answer your questions about it. You can ask me anything — from specific technical details to broader concepts discussed in the post.\n\nSome questions you might want to explore:\n• What are the trade-offs mentioned between monoliths and microservices?\n• How does the author suggest handling database migrations?\n• What observability tools does the article recommend?`,
    aiTranslation: `[ES] Este artículo explora los principios fundamentales de la arquitectura de software moderna, con énfasis en la escalabilidad y el mantenimiento. El autor aborda tres temas principales: patrones de diseño de microservicios, estrategias de optimización de bases de datos y el papel de la observabilidad en sistemas en producción.\n\n[FR] Cet article explore les principes fondamentaux de l'architecture logicielle moderne, en mettant l'accent sur l'évolutivité et la maintenabilité.\n\n[DE] Dieser Artikel untersucht die Grundprinzipien moderner Softwarearchitektur mit Schwerpunkt auf Skalierbarkeit und Wartbarkeit.`,
    writingAssistant: `I found a few areas where the writing could be improved:\n\n**Clarity** — Paragraph 3 uses passive voice heavily. Consider rewriting "It was found that..." as "We found that..." for more direct impact.\n\n**Structure** — The transition between the microservices section and the database section feels abrupt. A bridging sentence would help the flow.\n\n**Tone** — The conclusion is strong but ends without a clear call to action. Consider adding one concrete next step for the reader.`,
    titleGeneration: `Here are 5 title suggestions based on your content:\n\n1. "Scalable by Design: The Architecture Patterns Every Engineer Should Know"\n2. "From Monolith to Microservices: A Practical Migration Guide"\n3. "Why Observability Is the Missing Piece in Your System Design"\n4. "Database Optimization That Actually Works (With Numbers to Prove It)"\n5. "The Modern Backend Playbook: Microservices, Databases, and Observability"`,
    seoAssistant: `**SEO analysis for this post:**\n\nPrimary keyword density: 1.2% (recommended: 1–2%) ✓\nMeta description: Missing — add a 155-character summary.\nHeading structure: H1 present, missing H2 subheadings for scannability.\nInternal links: 0 found — link to at least 2–3 related posts.\nReadability score: 68/100 (Flesch) — good for technical audience.\n\n**Suggested meta description:**\n"Learn the architecture patterns behind scalable systems — microservices, database optimization, and observability explained with real examples."`,
    tagGeneration: `Suggested tags based on your content:\n\n**Primary:** #microservices #softwarearchitecture #backend\n**Secondary:** #database #observability #scalability #systemdesign\n**Trending:** #devops #cloudnative #distributedsystems\n\nRecommended: use 5–7 tags for best reach. Prioritize primary tags and add 2–3 from secondary.`,
    aiCovers: `Generating cover concept based on your title and content...\n\nSuggested visual direction: Abstract geometric pattern representing connected nodes — evokes microservices and distributed systems. Recommended palette: deep navy with electric blue accents. Typography: bold sans-serif title centered, minimal subtitle below.\n\n[Cover generation available with Premium plan]`,
    notesToArticle: `Converting your notes to a structured article draft...\n\nIntroduction paragraph generated. Three main sections identified from your notes. Conclusion with call-to-action drafted.\n\n[Full conversion available with Premium plan]`,
    custom: `Here's what I found based on your question:\n\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.\n\nIn id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.`,
}

interface AIResponseModalProps {
    toolKey: string | null
    customPrompt?: string
    onClose: () => void
    dark: boolean
}

const AIResponseModal = ({ toolKey, onClose, dark, customPrompt }: AIResponseModalProps) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const meta = toolKey ? TOOL_META[toolKey] : null
    const response = toolKey ? SIMULATED_RESPONSES[toolKey] : ''

    // close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    // lock body scroll
    // AIResponseModal — make sure this fires
    useEffect(() => {
        document.body.style.overflow = toolKey ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [toolKey])

    return (
        <AnimatePresence>
            {toolKey && meta && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50"
                        style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    />

                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {toolKey === 'custom' && customPrompt ? customPrompt : meta.label}
                        </p>
                        <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Generated by AI · just now
                        </p>
                    </div>

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className={`fixed z-50 inset-x-4 top-[10%] mx-auto max-w-xl rounded-2xl border overflow-hidden
                            ${dark
                                ? 'bg-[#27272A] border-gray-800'
                                : 'bg-white border-gray-100'
                            }`}
                    >
                        {/* Header */}
                        <div className={`flex items-center gap-3 px-5 py-4 border-b
                            ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-950/40 flex-shrink-0">
                                <i className={`ti ${meta.icon}`} style={{ fontSize: 17, color: meta.color }} aria-hidden />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {meta.label}
                                </p>
                                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Generated by AI · just now
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors flex-shrink-0
                                    ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            >
                                <i className="ti ti-x" style={{ fontSize: 16 }} />
                            </button>
                        </div>

                        {/* Response body */}
                        <div
                            ref={contentRef}
                            className={`px-5 py-4 max-h-[60vh] overflow-y-auto text-sm leading-relaxed whitespace-pre-line
                                chat-scroll-dark
                                ${dark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            {response}
                        </div>

                        {/* Footer */}
                        <div className={`flex items-center justify-between px-5 py-3 border-t
                                ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                            <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                                AI can make mistakes — review before publishing.
                            </p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(response)
                                }}
                                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors
                                    ${dark
                                        ? 'border-gray-700 text-gray-400 hover:bg-gray-800'
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <i className="ti ti-copy" style={{ fontSize: 13 }} />
                                Copy
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default AIResponseModal