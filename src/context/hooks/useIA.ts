import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

type PromptType = 'title' | 'description' | 'summary' | 'improve' | 'custom'

const prompts: Record<PromptType, (content: string) => string> = {
    title: (content) => `Generate a strong, catchy blog post title based on this content. Return only the title, no quotes or explanation:\n\n${content}`,
    description: (content) => `Write a short SEO-friendly description (max 160 chars) for this content. Return only the description:\n\n${content}`,
    summary: (content) => `Summarize this content, minium 3 sentences if content is < 500 chracteres, if 
    content is > 500 5 - 10 sentences maybe more. Return only the summary, ignore images or videos links:\n\n${content}`,
    improve: (content) => `Improve the writing of this text, keeping the same meaning. Return only the improved text:\n\n${content}`,
    custom: (content) => `You are a helpful assistant. Answer the following request:\n\n${content}`,
}

const useIA = () => {
    const [loadingType, setLoadingType] = useState<PromptType | null>(null);
    const [errorIA, setErrorIA] = useState<string | null>(null);
    const [response, setResponse] = useState<string>('');

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
            setErrorIA(err?.message || "An error occurred.")
            return null;
        } finally {
            setLoadingType(null);
        }
    }

    return { loadingType, errorIA, response, requestIA }
}

export default useIA;