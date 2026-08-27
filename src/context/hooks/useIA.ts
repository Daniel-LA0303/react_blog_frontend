import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { useSwal } from "../../hooks/useSwal";

export type PromptType = 'title' | 'description' | 'summary' | 'improve' | 'custom' | 'quiz' | 'tone_technical'
    | 'tone_professional' | 'tone_casual' | 'tone_educational' | 'tone_senior'

const prompts: Record<PromptType, (content: string) => string> = {
    title: (content) => `Generate a strong, catchy blog post title based on this content. Return only the title, no quotes or explanation:\n\n${content}`,
    description: (content) => `Write a short SEO-friendly description (max 160 chars) for this content. Return only the description:\n\n${content}`,
    summary: (content) => `Summarize this content, minium 3 sentences if content is < 500 chracteres, if 
    content is > 500 5 - 10 sentences maybe more. Return only the summary, ignore images or videos links:\n\n${content}`,
    improve: (content) => `Improve the writing of this text, keeping the same meaning. Return only the improved text:\n\n${content}`,
    custom: (content) => `You are a helpful assistant. Answer the following request:\n\n${content}`,
    quiz: (content) => `Generate 3 - 5 multiple choice questions based on this content. Return ONLY valid JSON in this exact format, no markdown:
        {"questions":[{"id":1,"question":"...","options":[{"text":"...","isCorrect":false},{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]}
        Content:\n${content}`,
    tone_technical: (content) => `You are rewriting a blog post. The input is HTML from a Tiptap editor. Rewrite it in a technical tone: precise terminology, implementation details, targeting experienced developers. Return only valid Tiptap-compatible HTML. Use only these tags: <h1> <h2> <h3> <p> <ul> <ol> <li> <strong> <em> <code> <pre><code class="language-*">. Preserve code blocks. No markdown, no backticks, no explanation, no doctype, no <html> or <body> tags. Just the inner HTML content:\n\n${content}`,
    tone_professional: (content) => `You are rewriting a blog post. The input is HTML from a Tiptap editor. Rewrite it in a professional tone: formal, structured, polished. Return only valid Tiptap-compatible HTML. Use only these tags: <h1> <h2> <h3> <p> <ul> <ol> <li> <strong> <em>. No markdown, no backticks, no explanation, no doctype, no <html> or <body> tags. Just the inner HTML content:\n\n${content}`,
    tone_casual: (content) => `You are rewriting a blog post. The input is HTML from a Tiptap editor. Rewrite it in a casual, friendly tone: conversational, approachable, easy to read. Return only valid Tiptap-compatible HTML. Use only these tags: <h1> <h2> <h3> <p> <ul> <ol> <li> <strong> <em>. No markdown, no backticks, no explanation, no doctype, no <html> or <body> tags. Just the inner HTML content:\n\n${content}`,
    tone_educational: (content) => `You are rewriting a blog post. The input is HTML from a Tiptap editor. Rewrite it in an educational tone: clear explanations, examples, step-by-step guidance. Return only valid Tiptap-compatible HTML. Use only these tags: <h1> <h2> <h3> <p> <ul> <ol> <li> <strong> <em> <code> <pre><code class="language-*">. No markdown, no backticks, no explanation, no doctype, no <html> or <body> tags. Just the inner HTML content:\n\n${content}`,
    tone_senior: (content) => `You are rewriting a blog post. The input is HTML from a Tiptap editor. Rewrite it as a senior engineer would write: opinionated, direct, pragmatic, mentions real-world tradeoffs, zero fluff. Return only valid Tiptap-compatible HTML. Use only these tags: <h1> <h2> <h3> <p> <ul> <ol> <li> <strong> <em> <code> <pre><code class="language-*">. No markdown, no backticks, no explanation, no doctype, no <html> or <body> tags. Just the inner HTML content:\n\n${content}`,
}

const useIA = () => {
    const [loadingType, setLoadingType] = useState<PromptType | null>(null);
    const [errorIA, setErrorIA] = useState<string | null>(null);
    const [response, setResponse] = useState<string>('');

    const { showConfirmSwal, showAutoSwal } = useSwal();

    const requestIA = async (type: PromptType, content: string) => {
        setLoadingType(type);
        setErrorIA(null);
        setResponse('');
        try {
            const ai = new GoogleGenAI({
                apiKey: import.meta.env.VITE_GEMINI_API_KEY,
            })
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompts[type](content),
            })
            const responseText = result.text as string
            setResponse(responseText);
            return responseText;
        } catch (err: any) {
            console.error("IA request failed: ", err)
            setErrorIA(err?.message || "An error occurred.");
            showAutoSwal({ message: "Something is wrong, please retry later.", status: 'error', timer: 1500 })
            return null;
        } finally {
            setLoadingType(null);
        }
    }

    return { loadingType, errorIA, response, requestIA }
}

export default useIA;