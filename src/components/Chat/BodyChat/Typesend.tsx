import { useRef, useState } from 'react'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import useSendMessage from '../../../context/hooks/useSendMessage'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'
import useConversation from '../../../context/hooks/useConversation'
import clientAuthAxios from '../../../services/clientAuthAxios'
import { SendNewMessageI } from '../../../interfaces/message.interfaces'

function Typesend() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState<string | null>(null);
  const { sendMessages } = useSendMessage()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // when change or upload image in backend we show it
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await clientAuthAxios.post('/posts/image-post', formData)
        console.log(res);
        setImageLink(res.data.secure_url);
      } catch (error) {
        console.log(error)
      }
    }
    setMessage("'IMAGE'");
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))

  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (sending || (!message.trim() && !imageFile)) return
    setSending(true)
    // TODO
    //await sendMessages(message, imageFile ? 'IMAGE' : 'TEXT', imageFile, replyTo?._id)
    //await sendMessages(message);
    const newMessage: SendNewMessageI = {
      message,
      messageType: imageFile ? 'IMAGE' : 'TEXT',
      replyTo: replyTo?._id,
      image: imageLink,
    }

    await sendMessages(newMessage);

    setMessage('')
    removeImage()
    setReplyTo(null)  // clear reply
    setSending(false)
    setEmojiOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e)
  }

  const handleEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji)
  }
  const { replyTo, setReplyTo } = useConversation()



  return (
    <div className={`relative px-3 py-3 border-t flex-shrink-0
      ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>

      {/* Reply preview */}
      {replyTo && (
        <div className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-xl border-l-2 border-[#2563EB]
          ${dark ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#2563EB] mb-0.5">
              {replyTo.senderId?.name || 'Message'}
            </p>
            <p className={`text-xs truncate ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {replyTo.messageType === 'TEXT' ? (replyTo.message?.length > 60 ? replyTo.message.slice(0, 60) + '...' : replyTo.message) : (

                <img
                  src={replyTo.image}
                  className="w-16 h-12 object-cover hover:opacity-85 transition-opacity mx-1"
                />

              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReplyTo(null)}
            className={`flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full
              ${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {emojiOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setEmojiOpen(false)} />
      )}

      {emojiOpen && (
        <div className="absolute bottom-full left-3 mb-2 z-50" onClick={e => e.stopPropagation()}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={dark ? Theme.DARK : Theme.LIGHT}
            height={380} width={320}
            searchDisabled={false} skinTonesDisabled lazyLoadEmojis
          />
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="mb-2 flex gap-2 flex-wrap">
          <div className="relative w-18 h-18">
            <img
              src={imagePreview}
              alt="preview"
              className="w-16 h-16 rounded-xl object-cover border border-gray-600"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}
                strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      <form onSubmit={handleSubmit} className="flex items-center gap-2">

        {/* Emoji toggle */}
        <button type="button" onClick={() => setEmojiOpen(v => !v)}
          className={`flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-xl transition-colors active:scale-90
            ${emojiOpen ? 'bg-[#2563EB]/15 text-[#2563EB]'
              : dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* Image upload button */}
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className={`flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-xl transition-colors active:scale-90
            ${imageFile ? 'bg-[#2563EB]/15 text-[#2563EB]'
              : dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
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
            disabled={imageFile ? true : false}
            className={`flex-1 bg-transparent text-sm outline-none
              ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
          />
        </div>

        {/* Send button */}
        <button type="submit"
          disabled={sending || (!message.trim() && !imageFile)}
          className={`flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-xl transition-colors active:scale-90
            ${(message.trim() || imageFile) && !sending
              ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
              : dark ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
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