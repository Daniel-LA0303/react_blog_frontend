import { useRef, useState } from 'react'
import EmojiPicker, { Theme } from 'emoji-picker-react'

import useSendMessage from '../../../context/hooks/useSendMessage'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'

function Typesend() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const { sendMessages } = useSendMessage()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (sending || !message.trim()) return
    setSending(true)
    await sendMessages(message)
    setMessage('')
    setSending(false)
    setEmojiOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e)
  }

  const handleEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji)
    // no llamamos focus() — evita que el teclado aparezca/desaparezca en mobile
  }

  return (
    <div className={`relative px-3 py-3 border-t flex-shrink-0
      ${dark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-100'}`}>

      {/* Overlay — cierra el picker al tocar afuera, sin afectar el input */}
      {emojiOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setEmojiOpen(false)}
        />
      )}

      {/* Emoji picker */}
      {emojiOpen && (
        <div
          className="absolute bottom-full left-3 mb-2 z-50"
          // evita que el click dentro del picker llegue al overlay
          onClick={e => e.stopPropagation()}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={dark ? Theme.DARK : Theme.LIGHT}
            height={380}
            width={320}
            searchDisabled={false}
            skinTonesDisabled
            lazyLoadEmojis
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">

        {/* Emoji toggle */}
        <button
          type="button"
          onClick={() => setEmojiOpen(v => !v)}
          className={`flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-xl transition-colors active:scale-90
            ${emojiOpen
              ? 'bg-[#2563EB]/15 text-[#2563EB]'
              : dark
                ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* Input */}
        <div className={`flex-1 flex items-center rounded-xl border px-3.5 py-2.5 transition-colors duration-150
          focus-within:ring-2 focus-within:ring-offset-0 focus-within:border-[#2563EB] focus-within:ring-[#2563EB]/20
          ${dark ? 'bg-[#1e1e1e] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Message…"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent text-sm outline-none
              ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className={`flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-xl transition-colors active:scale-90
            ${message.trim() && !sending
              ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
              : dark
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {sending ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </form>
    </div>
  )
}

export default Typesend